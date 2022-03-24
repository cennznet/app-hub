import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { defineTxModal } from "@/utils/bridge/modal";
import { useBridge } from "@/providers/BridgeProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import TxModal from "@/components/bridge/TxModal";
import ErrorModal from "@/components/bridge/ErrorModal";
import { CENNZAccount, CENNZAsset, TxModalAttributes } from "@/types";
import ConnectWalletButton from "@/components/shared/ConnectWalletButton";
import {
	checkWithdrawStatus,
	fetchEstimatedFee,
	withdrawETHSide,
} from "@/utils/bridge";
import Advanced from "@/components/bridge/Advanced";
import { Divider } from "@mui/material";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { EthEventProof } from "@cennznet/api/derives/ethBridge/types";

const Withdraw: React.FC<{
	token: CENNZAsset;
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
	const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
	const [modal, setModal] = useState<TxModalAttributes>(null);
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

		setEnoughBalance(foundToken?.value.gte(Number(amount)));
	}, [token, balances, api, amount, setEnoughBalance]);

	const resetModal = () => {
		setModal(null);
		setModalOpen(false);
	};

	const withdraw = async () => {
		setModalOpen(false);
		const bridgeActive = await checkWithdrawStatus(api, Contracts.peg);

		if (!bridgeActive)
			return setModal(defineTxModal("bridgePaused", "", setModalOpen));

		const tokenAddress = await api.query.erc20Peg.assetIdToErc20(token.assetId);
		if (!tokenAddress)
			return setModal(defineTxModal("error", "noTokenSelected", setModalOpen));

		const withdrawAmount = ethers.utils
			.parseUnits(String(amount), token.decimals)
			.toString();

		const eventProof: EthEventProof = await withdrawCENNZside(
			withdrawAmount,
			Account,
			token.assetId
		);

		const tx: TransactionResponse = await withdrawETHSide(
			withdrawAmount,
			eventProof,
			Account,
			tokenAddress.toString(),
			api,
			Contracts.bridge,
			Contracts.peg
		);
		setModal(defineTxModal("withdrawETHside", tx.hash, setModalOpen));
		await tx.wait();
		setModal(defineTxModal("finished", "", setModalOpen));
		await updateBalances();
	};

	const withdrawCENNZside = async (
		amount: string,
		ethAddress: string,
		tokenId: number
	) => {
		setModal(defineTxModal("withdrawCENNZside", "", setModalOpen));

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
				eventProof = await api.derive.ethBridge.eventProof(eventProofId);
				if (!!eventProof) {
					console.log("Event proof found;::", eventProof);
					unsubHeads();
					resolve(eventProof);
				}
			});
		});

		return eventProof;
	};

	// const withdrawEthSide = async (
	// 	withdrawAmount: any,
	// 	eventProof: any,
	// 	ethAddress: string,
	// 	tokenAddress: string,
	// 	blockHash?: string
	// ) => {
	// 	setModalOpen(false);
	//
	// 	const verificationFee = await Contracts.bridge.verificationFee();
	// 	let notaryKeys;
	// 	if (!!blockHash) {
	// 		notaryKeys = await api.query.ethBridge.notaryKeys.at(blockHash);
	// 	} else {
	// 		notaryKeys = await api.query.ethBridge.notaryKeys();
	// 	}
	//
	// 	const validators = notaryKeys.map((validator: ethers.utils.BytesLike) => {
	// 		// session key is not set
	// 		if (
	// 			ethers.utils.hexlify(validator) ===
	// 			ethers.utils.hexlify(
	// 				"0x000000000000000000000000000000000000000000000000000000000000000000"
	// 			)
	// 		) {
	// 			return ethers.constants.AddressZero;
	// 		}
	// 		return ethers.utils.computeAddress(validator);
	// 	});
	//
	// 	let gasEstimate = await Contracts.peg.estimateGas.withdraw(
	// 		tokenAddress,
	// 		withdrawAmount,
	// 		ethAddress,
	// 		{
	// 			eventId: eventProof.eventId,
	// 			validatorSetId: eventProof.validatorSetId,
	// 			v: eventProof.v,
	// 			r: eventProof.r,
	// 			s: eventProof.s,
	// 			validators,
	// 		},
	// 		{
	// 			value: verificationFee,
	// 		}
	// 	);
	//
	// 	let gasLimit = (gasEstimate.toNumber() * 1.02).toFixed(0);
	//
	// 	let tx: any = await Contracts.peg.withdraw(
	// 		tokenAddress,
	// 		withdrawAmount,
	// 		ethAddress,
	// 		{
	// 			eventId: eventProof.eventId,
	// 			validatorSetId: eventProof.validatorSetId,
	// 			v: eventProof.v,
	// 			r: eventProof.r,
	// 			s: eventProof.s,
	// 			validators,
	// 		},
	// 		{
	// 			value: verificationFee,
	// 			gasLimit: gasLimit,
	// 		}
	// 	);
	//
	// 	setModal(defineTxModal("withdrawETHside", tx.hash, setModalOpen));
	// 	await tx.wait();
	// 	setModal(defineTxModal("finished", "", setModalOpen));
	// 	await updateBalances();
	// };

	return (
		<>
			{modalOpen && (
				<TxModal
					modalOpen={modalOpen}
					modalAttributes={modal}
					resetModal={resetModal}
				/>
			)}
			{errorModalOpen && (
				<ErrorModal setModalOpen={setErrorModalOpen} modalState={modal.state} />
			)}
			<Advanced setModal={setModal} setModalOpen={setModalOpen} />
			<Divider sx={{ width: "550px", m: "2em 0 2em" }} />
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
