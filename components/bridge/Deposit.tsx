import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { decodeAddress } from "@polkadot/keyring";
import { Box, Button, TextField } from "@mui/material";
import GenericERC20TokenAbi from "../../artifacts/GenericERC20Token.json";
import { defineTxModal } from "../../utils/bridge/modal";
import { getMetamaskBalance, ETH } from "../../utils/helpers";
import { useBlockchain } from "../../providers/BlockchainProvider";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import TxModal from "./TxModal";
import ErrorModal from "./ErrorModal";
import TokenPicker from "../shared/TokenPicker";
import CENNZnetAccountPicker from "../shared/CENNZnetAccountPicker";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

const Deposit: React.FC<{}> = () => {
	const [customAddress, setCustomAddress] = useState(false);
	const [token, setToken] = useState("");
	const [amount, setAmount] = useState("");
	const [selectedAccount, updateSelectedAccount] = useState({
		address: "",
		name: "",
	});
	const [modalOpen, setModalOpen] = useState(false);
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const [modalState, setModalState] = useState("");
	const [modal, setModal] = useState({
		state: "",
		text: "",
		hash: "",
	});
	const [tokenBalance, setTokenBalance] = useState<Number>();
	const { Contracts, Signer, Account, initBlockchain }: any = useBlockchain();
	const { api }: any = useCENNZApi();

	const connectMetamask = async () => {
		const { ethereum } = window as any;
		try {
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});
			const ethChainId = await ethereum.request({ method: "eth_chainId" });

			if (ETH_CHAIN_ID === "1" && ethChainId !== "0x1") {
				await ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: "0x1" }],
				});
				window.location.reload();
			} else if (ETH_CHAIN_ID === "42" && ethChainId !== "0x2a") {
				await ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: "0x2a" }],
				});
				window.location.reload();
			}

			initBlockchain(ethereum, accounts);
		} catch (err) {
			console.log(err.message);
			setModalState("noMetamask");
			setErrorModalOpen(true);
		}
	};

	//Check MetaMask account has enough tokens to deposit
	useEffect(() => {
		const { ethereum }: any = window;
		if (token !== "")
			(async () => {
				let balance = await getMetamaskBalance(ethereum, token, Account);
				setTokenBalance(balance);
			})();
	}, [token, Account]);

	const resetModal = () => {
		setModal({ state: "", text: "", hash: "" });
		setModalOpen(false);
	};

	const depositEth = async () => {
		let tx: any = await Contracts.peg.deposit(
			ETH,
			ethers.utils.parseUnits(amount),
			decodeAddress(selectedAccount.address),
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
			token,
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
			token,
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
			if (token === ETH) {
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
			<Box
				component="form"
				sx={{
					width: "552px",
					height: "auto",
					margin: "0 auto",
					background: "#FFFFFF",
					border: "4px solid #1130FF",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					padding: "0px",
				}}
			>
				<TokenPicker setToken={setToken} />

				<TextField
					label="Amount"
					variant="outlined"
					required
					sx={{
						width: "80%",
						m: "30px 0 30px",
					}}
					onChange={(e) => setAmount(e.target.value)}
					helperText={
						tokenBalance < Number(amount) ? "Account balance too low" : ""
					}
				/>
				{customAddress ? (
					<>
						<TextField
							label="Destination"
							variant="outlined"
							required
							sx={{
								width: "80%",
							}}
							onChange={(e) =>
								updateSelectedAccount({
									name: "",
									address: e.target.value,
								})
							}
						/>
						<Button
							size="small"
							variant="outlined"
							onClick={() => setCustomAddress(false)}
							sx={{
								fontFamily: "Teko",
								fontWeight: "bold",
								fontSize: "21px",
								lineHeight: "124%",
								color: "#1130FF",
								width: "80%",
								mb: "30px",
								textTransform: "none",
							}}
						>
							SELECT CENNZnet ADDRESS INSTEAD*
						</Button>
					</>
				) : (
					<>
						<CENNZnetAccountPicker
							updateSelectedAccount={updateSelectedAccount}
						/>
						<Button
							size="small"
							variant="outlined"
							onClick={() => setCustomAddress(true)}
							sx={{
								fontFamily: "Teko",
								fontWeight: "bold",
								fontSize: "21px",
								lineHeight: "124%",
								color: "#1130FF",
								width: "80%",
								mb: "30px",
								textTransform: "none",
							}}
						>
							ENTER CENNZnet ADDRESS INSTEAD*
						</Button>
					</>
				)}
				{Account ? (
					<Button
						sx={{
							fontFamily: "Teko",
							fontWeight: "bold",
							fontSize: "21px",
							lineHeight: "124%",
							color: "#1130FF",
							mt: "30px",
							mb: "50px",
						}}
						disabled={
							amount &&
							token &&
							selectedAccount &&
							Number(amount) <= tokenBalance
								? false
								: true
						}
						size="large"
						variant="outlined"
						onClick={deposit}
					>
						confirm
					</Button>
				) : (
					<Button
						sx={{
							fontFamily: "Teko",
							fontWeight: "bold",
							fontSize: "21px",
							lineHeight: "124%",
							color: "#1130FF",
							mt: "30px",
							mb: "50px",
						}}
						size="large"
						variant="outlined"
						onClick={connectMetamask}
					>
						connect metamask
					</Button>
				)}
			</Box>
		</>
	);
};

export default Deposit;
