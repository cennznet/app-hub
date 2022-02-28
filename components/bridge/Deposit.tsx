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
import { BridgeToken, CENNZAccount } from "@/types";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";

const Deposit: React.FC<{
	token: BridgeToken;
	amount: string;
	selectedAccount: CENNZAccount;
	disabled: boolean;
}> = ({ token, amount, selectedAccount, disabled }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const [modalState, _] = useState("");
	const [modal, setModal] = useState({
		state: "",
		title: "",
		text: "",
		hash: "",
	});
	const { Contracts, Signer }: any = useBridge();
	const { api }: any = useCENNZApi();
	const { updateBalances } = useCENNZWallet();

	const resetModal = () => {
		setModal({ state: "", text: "", hash: "", title: "" });
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
					modalState={modal.state}
					modalText={modal.text}
					modalTitle={modal.title}
					etherscanHash={modal.hash}
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
