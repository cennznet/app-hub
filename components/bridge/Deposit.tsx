import React, { useState } from "react";
import { ethers } from "ethers";
import GenericERC20TokenAbi from "@/artifacts/GenericERC20Token.json";
import { defineTxModal } from "@/utils/bridge/modal";
import { checkDepositStatus, ETH, getDepositValues } from "@/utils/bridge";
import { useBridge } from "@/providers/BridgeProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import TxModal from "@/components/bridge/TxModal";
import ErrorModal from "@/components/bridge/ErrorModal";
import ConnectWalletButton from "@/components/shared/ConnectWalletButton";
import { EthereumToken, CENNZAccount, TxModalAttributes } from "@/types";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";

const Deposit: React.FC<{
	token: EthereumToken;
	amount: string;
	selectedAccount: CENNZAccount;
	disabled: boolean;
}> = ({ token, amount, selectedAccount, disabled }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const [modalState, _] = useState("");
	const [modal, setModal] = useState<TxModalAttributes>(null);
	const { Contracts, Signer }: any = useBridge();
	const { api }: any = useCENNZApi();
	const { updateBalances } = useCENNZWallet();

	const resetModal = () => {
		setModal(null);
		setModalOpen(false);
	};

	const depositEth = async () => {
		const { amountInWei, address } = getDepositValues(
			amount,
			selectedAccount.address,
			token.decimals
		);
		let tx: any = await Contracts.peg.deposit(ETH, amountInWei, address, {
			value: amountInWei,
		});

		setModal(defineTxModal("deposit", tx.hash, setModalOpen));
		await tx.wait();
		setModal(defineTxModal("relayer", tx.hash, setModalOpen));
	};

	const depositERC20 = async () => {
		const tokenContract = new ethers.Contract(
			token.address,
			GenericERC20TokenAbi,
			Signer
		);

		const { amountInWei, address } = getDepositValues(
			amount,
			selectedAccount.address,
			token.decimals
		);

		let tx: any = await tokenContract.approve(
			Contracts.peg.address,
			amountInWei
		);
		setModal(defineTxModal("approve", tx.hash, setModalOpen));
		await tx.wait();

		tx = await Contracts.peg.deposit(token.address, amountInWei, address);
		setModal(defineTxModal("deposit", tx.hash, setModalOpen));
		await tx.wait();
		setModal(defineTxModal("relayer", tx.hash, setModalOpen));
	};

	const deposit = async () => {
		setModalOpen(false);
		const bridgeActive = await checkDepositStatus(api, Contracts.peg);

		if (bridgeActive) {
			if (token.address === ETH) {
				await depositEth();
			} else {
				await depositERC20();
			}
			await updateBalances();
		} else {
			setModal(defineTxModal("bridgePaused", "", setModalOpen));
		}
	};

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
				<ErrorModal setModalOpen={setErrorModalOpen} modalState={modalState} />
			)}
			<ConnectWalletButton
				disabled={disabled}
				onClick={deposit}
				buttonText={"CONFIRM"}
				requireCennznet={false}
				requireMetamask={true}
			/>
		</>
	);
};

export default Deposit;
