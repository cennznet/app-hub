import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { defineTxModal } from "@/utils/bridge/modal";
import { useBridge } from "@/providers/BridgeProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import TxModal from "@/components/bridge/TxModal";
import ErrorModal from "@/components/bridge/ErrorModal";
import { BridgeToken, CENNZAccount } from "@/types";
import ConnectWalletButton from "@/components/shared/ConnectWalletButton";
import { checkWithdrawStatus, fetchEstimatedFee } from "@/utils/bridge";

const Withdraw: React.FC<{
	token: BridgeToken;
	amount: string;
	selectedAccount: CENNZAccount;
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
	const { Contracts, Account, Signer }: any = useBridge();
	const { api }: any = useCENNZApi();
	const { wallet, balances, updateBalances } = useCENNZWallet();
	const signer = wallet?.signer;

	useEffect(() => {
		if (!selectedAccount || !Account) return;

		(async () => {
			const totalFeeEstimate = await fetchEstimatedFee(
				Signer,
				Contracts.bridge
			);

			setEstimatedFee(Number(totalFeeEstimate.toFixed(6)));
		})();
	}, [selectedAccount, Account, Contracts.bridge, Signer, setEstimatedFee]);

	//Check CENNZnet account has enough tokens to withdraw
	useEffect(() => {
		if (!token || !balances || !api) return;
		const foundToken = balances.find(
			(balance) => balance.symbol === token.symbol
		);

		setEnoughBalance(foundToken?.value >= Number(amount));
	}, [token, balances, api, amount, setEnoughBalance]);

	const resetModal = () => {
		setModal({ state: "", text: "", hash: "" });
		setModalOpen(false);
	};

	const withdraw = async () => {
		setModalOpen(false);
		const bridgeActive = await checkWithdrawStatus(api, Contracts.peg);

		if (bridgeActive) {
			if (token.address !== "") {
				setModal(defineTxModal("withdrawCENNZside", "", setModalOpen));

				const withdrawAmount = ethers.utils
					.parseUnits(String(amount), token.decimals)
					.toString();
				const eventProof = await withdrawCENNZside(
					withdrawAmount,
					Account,
					token.id
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
		tokenId: number
	) => {
		let eventProofId: any;

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

		const verificationFee = await Contracts.bridge.verificationFee();

		const v: any = [],
			r: any = [],
			s: any = [];

		eventProof.signatures.forEach((signature: any) => {
			const hexifySignature = ethers.utils.hexlify(signature);
			const sig = ethers.utils.splitSignature(hexifySignature);
			v.push(sig.v);
			r.push(sig.r);
			s.push(sig.s);
		});

		const validators = (await api.query.ethBridge.notaryKeys()).map(
			(validator: ethers.utils.BytesLike) => {
				// session key is not set
				if (
					ethers.utils.hexlify(validator) ===
					ethers.utils.hexlify(
						"0x000000000000000000000000000000000000000000000000000000000000000000"
					)
				) {
					return ethers.constants.AddressZero;
				}
				return ethers.utils.computeAddress(validator);
			}
		);

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
				validators,
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
				validators,
			},
			{
				value: verificationFee,
				gasLimit: gasLimit,
			}
		);

		setModal(defineTxModal("withdrawETHside", tx.hash, setModalOpen));
		await tx.wait();
		setModal(defineTxModal("finished", "", setModalOpen));
		await updateBalances();
	};

	return (
		<>
			{modalOpen && (
				<TxModal
					modalState={modal.state}
					modalOpen={modalOpen}
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
