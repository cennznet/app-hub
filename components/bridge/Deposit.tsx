import React, { useState } from "react";
import { ethers } from "ethers";
import { decodeAddress } from "@polkadot/keyring";
import GenericERC20TokenAbi from "../../artifacts/GenericERC20Token.json";
import { defineTxModal } from "../../utils/bridge/modal";
import { ETH } from "../../utils/bridge/helpers";
import { useBlockchain } from "../../providers/BlockchainProvider";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import TxModal from "./TxModal";
import ErrorModal from "./ErrorModal";
import ConnectWalletButton from "../shared/ConnectWalletButton";
import { BridgeToken, CennznetAccount } from "../../types";

const Deposit: React.FC<{
	token: BridgeToken;
	amount: string;
	selectedAccount: CennznetAccount;
}> = ({ token, amount, selectedAccount }) => {
	//TODO refactor custom address
	const [customAddress, setCustomAddress] = useState(false);
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

			{/*	{customAddress ? (*/}
			{/*		<>*/}
			{/*<TextField*/}
			{/*	label="Destination"*/}
			{/*	variant="outlined"*/}
			{/*	required*/}
			{/*	sx={{*/}
			{/*		width: "80%",*/}
			{/*	}}*/}
			{/*	onChange={(e) =>*/}
			{/*		updateSelectedAccount({*/}
			{/*			name: "",*/}
			{/*			address: e.target.value,*/}
			{/*		})*/}
			{/*	}*/}
			{/*/>*/}
			{/*			<Button*/}
			{/*				size="small"*/}
			{/*				variant="outlined"*/}
			{/*				onClick={() => setCustomAddress(false)}*/}
			{/*				sx={{*/}
			{/*					fontFamily: "Teko",*/}
			{/*					fontWeight: "bold",*/}
			{/*					fontSize: "21px",*/}
			{/*					lineHeight: "124%",*/}
			{/*					color: "#1130FF",*/}
			{/*					width: "80%",*/}
			{/*					mb: "30px",*/}
			{/*					textTransform: "none",*/}
			{/*				}}*/}
			{/*			>*/}
			{/*				SELECT CENNZnet ADDRESS INSTEAD**/}
			{/*			</Button>*/}
			{/*		</>*/}
			{/*	) : (*/}
			{/*		<>*/}
			{/*			<CENNZnetAccountPicker*/}
			{/*				updateSelectedAccount={updateSelectedAccount}*/}
			{/*			/>*/}
			{/*			<Button*/}
			{/*				size="small"*/}
			{/*				variant="outlined"*/}
			{/*				onClick={() => setCustomAddress(true)}*/}
			{/*				sx={{*/}
			{/*					fontFamily: "Teko",*/}
			{/*					fontWeight: "bold",*/}
			{/*					fontSize: "21px",*/}
			{/*					lineHeight: "124%",*/}
			{/*					color: "#1130FF",*/}
			{/*					width: "80%",*/}
			{/*					mb: "30px",*/}
			{/*					textTransform: "none",*/}
			{/*				}}*/}
			{/*			>*/}
			{/*				ENTER CENNZnet ADDRESS INSTEAD**/}
			{/*			</Button>*/}
			{/*		</>*/}
			{/*	)}*/}
			{/*	{Account ? (*/}
			{/*		<Button*/}
			{/*			sx={{*/}
			{/*				fontFamily: "Teko",*/}
			{/*				fontWeight: "bold",*/}
			{/*				fontSize: "21px",*/}
			{/*				lineHeight: "124%",*/}
			{/*				color: "#1130FF",*/}
			{/*				mt: "30px",*/}
			{/*				mb: "50px",*/}
			{/*			}}*/}
			{/*			disabled={*/}
			{/*				amount &&*/}
			{/*				token &&*/}
			{/*				selectedAccount &&*/}
			{/*				Number(amount) <= tokenBalance*/}
			{/*					? false*/}
			{/*					: true*/}
			{/*			}*/}
			{/*			size="large"*/}
			{/*			variant="outlined"*/}
			{/*			onClick={deposit}*/}
			{/*		>*/}
			{/*			confirm*/}
			{/*		</Button>*/}
			{/*	) : (*/}
			{/*</Box>*/}
			<ConnectWalletButton
				onClick={deposit}
				buttonText={"CONFIRM"}
				requireCennznet={false}
				requireMetamask={true}
			/>
		</>
	);
};

export default Deposit;
