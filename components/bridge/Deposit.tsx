import React, { useState } from "react";
import { ethers } from "ethers";
import { decodeAddress } from "@polkadot/keyring";
import GenericERC20TokenAbi from "@/artifacts/GenericERC20Token.json";
import { defineTxModal } from "@/utils/bridge/modal";
import { ETH } from "@/utils/bridge";
import { useBlockchain } from "@/providers/BlockchainProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import TxModal from "@/components/bridge/TxModal";
import ErrorModal from "@/components/bridge/ErrorModal";
import ConnectWalletButton from "@/components/shared/ConnectWalletButton";
import { BridgeToken, CennznetAccount } from "@/types";

const Deposit: React.FC<{
	token: BridgeToken;
	amount: string;
	selectedAccount: CennznetAccount;
	disabled: boolean;
}> = ({ token, amount, selectedAccount, disabled }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const [modalState, _] = useState("");
	const [modal, setModal] = useState({
		state: "",
		text: "",
		hash: "",
	});
	const { Contracts, Signer }: any = useBlockchain();
	const { api }: any = useCENNZApi();

	const resetModal = () => {
		setModal({ state: "", text: "", hash: "" });
		setModalOpen(false);
	};

	const depositEth = async () => {
		let tx: any = await Contracts.peg.deposit(
			ETH,
			ethers.utils.parseUnits(amount),
			decodeAddress(selectedAccount?.address),
			{
				value: ethers.utils.parseUnits(amount),
			}
		);

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

		let tx: any = await tokenContract.approve(
			Contracts.peg.address,
			ethers.utils.parseEther(amount)
		);
		setModal(defineTxModal("approve", tx.hash, setModalOpen));
		await tx.wait();
		tx = await Contracts.peg.deposit(
			token.address,
			ethers.utils.parseUnits(amount),
			decodeAddress(selectedAccount.address)
		);
		setModal(defineTxModal("deposit", tx.hash, setModalOpen));
		await tx.wait();
		setModal(defineTxModal("relayer", tx.hash, setModalOpen));
	};

	const deposit = async () => {
		setModalOpen(false);
		const bridgePaused = await api.query.ethBridge.bridgePaused();
		const ETHdepositsActive = await Contracts.peg.depositsActive();
		const CENNZdepositsActive = await api.query.erc20Peg.depositsActive();
		if (
			bridgePaused.isFalse &&
			ETHdepositsActive &&
			CENNZdepositsActive.isTrue
		) {
			if (token.address === ETH) {
				depositEth();
			} else {
				depositERC20();
			}
		} else {
			setModal(defineTxModal("bridgePaused", "", setModalOpen));
		}
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
