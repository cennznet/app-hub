import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { defineTxModal } from "../../utils/bridge/modal";
import { useBlockchain } from "../../providers/BlockchainProvider";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import { useWallet } from "../../providers/SupportedWalletProvider";
import TxModal from "./TxModal";
import ErrorModal from "./ErrorModal";
import { BridgeToken, CennznetAccount } from "../../types";
import ConnectWalletButton from "../shared/ConnectWalletButton";

const Withdraw: React.FC<{
	token: BridgeToken;
	amount: string;
	selectedAccount: CennznetAccount;
	disabled: boolean;
	setEnoughBalance: Function;
	setEstimatedFee: Function;
}> = ({
	token,
	amount,
	selectedAccount,
	disabled,
	setEnoughBalance,
	setEstimatedFee,
}) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const [modal, setModal] = useState({
		state: "",
		text: "",
		hash: "",
	});
	const { Contracts, Account, Signer }: any = useBlockchain();
	const { api }: any = useCENNZApi();
	const { wallet, bridgeBalances } = useWallet();
	const signer = wallet?.signer;

	useEffect(() => {
		if (!selectedAccount || !Account) return;

		(async () => {
			let gasPrice = (await Signer.getGasPrice()).toString();
			gasPrice = ethers.utils.formatUnits(gasPrice);

			const gasEstimate = Number(gasPrice) * 150000;

			let verificationFee = await Contracts.bridge.verificationFee();
			verificationFee = ethers.utils.formatUnits(verificationFee);

			const totalFeeEstimate = gasEstimate + Number(verificationFee);

			setEstimatedFee(Number(totalFeeEstimate.toFixed(6)));
		})();
	}, [selectedAccount, Account, Contracts.bridge, Signer]);

	//Check CENNZnet account has enough tokens to withdraw
	useEffect(() => {
		if (!token || !bridgeBalances || !api) return;
		(async () => {
			const tokenExist = await api.query.erc20Peg.erc20ToAssetId(token.address);
			const tokenId = tokenExist.isSome
				? tokenExist.unwrap()
				: await api.query.genericAsset.nextAssetId();
			Object.values(bridgeBalances).map((token: any) => {
				if (token.tokenId === tokenId.toString()) {
					setEnoughBalance(token.balance > Number(amount));
				} else {
					setEnoughBalance(false);
				}
			});
		})();
	}, [token, bridgeBalances, api, amount]);

	const resetModal = () => {
		setModal({ state: "", text: "", hash: "" });
		setModalOpen(false);
	};

	const withdraw = async () => {
		setModalOpen(false);
		const bridgePaused = await api.query.ethBridge.bridgePaused();
		const CENNZwithdrawalsActive = await api.query.erc20Peg.withdrawalsActive();
		const ETHwithdrawalsActive = await Contracts.peg.withdrawalsActive();

		if (
			bridgePaused.isFalse &&
			CENNZwithdrawalsActive.isTrue &&
			ETHwithdrawalsActive
		) {
			if (token.address !== "") {
				setModal(defineTxModal("withdrawCENNZside", "", setModalOpen));
				let withdrawAmount = ethers.utils.parseUnits(amount).toString();

				const eventProof = await withdrawCENNZside(
					withdrawAmount,
					Account,
					token.address
				);
				await withdrawEthSide(
					withdrawAmount,
					eventProof,
					Account,
					token.address
				);
			} else {
				setModal(defineTxModal("error", "noTokenSelected", setModalOpen));
			}
		} else {
			setModal(defineTxModal("bridgePaused", "", setModalOpen));
		}
	};

	const withdrawCENNZside = async (
		amount: any,
		ethAddress: string,
		tokenAddress: string
	) => {
		let eventProofId: any;
		const tokenExist = await api.query.erc20Peg.erc20ToAssetId(tokenAddress);
		const tokenId = tokenExist.isSome
			? tokenExist.unwrap()
			: await api.query.genericAsset.nextAssetId();

		await new Promise<void>((resolve) => {
			api.tx.erc20Peg
				.withdraw(tokenId, amount, ethAddress)
				.signAndSend(
					selectedAccount.address,
					{ signer },
					async ({ status, events }: any) => {
						if (status.isInBlock) {
							for (const {
								event: { method, section, data },
							} of events) {
								if (section === "erc20Peg" && method == "Erc20Withdraw") {
									eventProofId = data[0];
									console.log("*******************************************");
									console.log("Withdraw claim on CENNZnet side successfully");
									resolve();
								}
							}
						}
					}
				);
		});

		let eventProof: any;
		await new Promise(async (resolve) => {
			const unsubHeads = await api.rpc.chain.subscribeNewHeads(async () => {
				console.log(`Waiting till event proof is fetched....`);
				const versionedEventProof = (
					await api.rpc.ethy.getEventProof(eventProofId)
				).toJSON();
				if (versionedEventProof !== null) {
					eventProof = versionedEventProof.eventProof;
					console.log("Event proof found;::", eventProof);
					unsubHeads();
					resolve(eventProof);
				}
			});
		});

		return eventProof;
	};

	const withdrawEthSide = async (
		withdrawAmount: any,
		eventProof: any,
		ethAddress: string,
		tokenAddress: string
	) => {
		setModalOpen(false);

		let verificationFee = await Contracts.bridge.verificationFee();
		const signatures = eventProof.signatures;
		let v: any = [],
			r: any = [],
			s: any = []; // signature params
		signatures.forEach((signature: any) => {
			const hexifySignature = ethers.utils.hexlify(signature);
			const sig = ethers.utils.splitSignature(hexifySignature);
			v.push(sig.v);
			r.push(sig.r);
			s.push(sig.s);
		});

		let gasEstimate = await Contracts.peg.estimateGas.withdraw(
			tokenAddress,
			withdrawAmount,
			ethAddress,
			{
				eventId: eventProof.eventId,
				validatorSetId: eventProof.validatorSetId,
				v,
				r,
				s,
			},
			{
				value: verificationFee,
			}
		);

		let gasLimit = (gasEstimate.toNumber() * 1.02).toFixed(0);

		let tx: any = await Contracts.peg.withdraw(
			tokenAddress,
			withdrawAmount,
			ethAddress,
			{
				eventId: eventProof.eventId,
				validatorSetId: eventProof.validatorSetId,
				v,
				r,
				s,
			},
			{
				value: verificationFee,
				gasLimit: gasLimit,
			}
		);

		setModal(defineTxModal("withdrawETHside", tx.hash, setModalOpen));
		await tx.wait();
		setModal(defineTxModal("finished", "", setModalOpen));
	};

	return (
		<>
			{modalOpen && (
				<TxModal
					modalState={modal.state}
					modalText={modal.text}
					etherscanHash={modal.hash}
					resetModal={resetModal}
				/>
			)}
			{errorModalOpen && (
				<ErrorModal setModalOpen={setErrorModalOpen} modalState={modal.state} />
			)}
			<ConnectWalletButton
				disabled={disabled}
				onClick={withdraw}
				buttonText={"CONFIRM"}
				requireCennznet={false}
				requireMetamask={true}
			/>
		</>
	);
};

export default Withdraw;
