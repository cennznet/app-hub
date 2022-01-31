import React, { useState } from "react";
import { isBrowser } from "react-device-detect";
import { Box, Button } from "@mui/material";
import { Frame, Heading, SmallText } from "../../theme/StyledComponents";
import { useBlockchain } from "../../providers/BlockchainProvider";
import { useWallet } from "../../providers/SupportedWalletProvider";
import ErrorModal from "../../components/bridge/ErrorModal";
import WalletModal from "../../components/shared/WalletModal";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

const Connect: React.FC<{ setBridgeState: Function }> = ({
	setBridgeState,
}) => {
	const { Account } = useBlockchain();
	const { initBlockchain } = useBlockchain();
	const { connectWallet, selectedAccount } = useWallet();
	const [modalOpen, setModalOpen] = useState(false);
	const [modalState, setModalState] = useState("");

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
			setModalState("noMetamask");
			setModalOpen(true);
		}
	};

	const CENNZnetButton = (
		<Frame
			sx={{
				top: "40%",
				cursor: "pointer",
				backgroundColor: "#FFFFFF",
				height: "60px",
				width: "70%",
			}}
			onClick={() => {
				connectWallet();
				setModalState("changeAccount");
				setModalOpen(true);
			}}
		>
			{selectedAccount ? (
				<>
					<Heading
						sx={{
							color: "primary.main",
							ml: "10px",
							mt: "3px",
							fontSize: "20px",
							flexGrow: 1,
							textTransform: "none",
						}}
					>
						CENNZnet
					</Heading>
					<SmallText
						sx={{
							color: "black",
							fontSize: "16px",
							whiteSpace: "nowrap",
							overflow: "hidden",
							ml: "5px",
						}}
					>
						{selectedAccount.meta.name}
					</SmallText>
				</>
			) : (
				<Heading
					sx={{
						fontSize: "20px",
						margin: "0 auto",
						color: "primary.main",
						textTransform: "none",
					}}
				>
					CONNECT CENNZnet WALLET
				</Heading>
			)}
		</Frame>
	);

	const MetamaskButton = (
		<Frame
			sx={{
				display: "flex",
				mt: "8%",
				width: "70%",
				height: "60px",
				cursor: "pointer",
				backgroundColor: "white",
			}}
			onClick={connectMetamask}
		>
			{Account ? (
				<>
					<Heading
						sx={{
							color: "primary.main",
							ml: "10px",
							mt: "3px",
							fontSize: "20px",
							flexGrow: 1,
						}}
					>
						METAMASK
					</Heading>
					<SmallText sx={{ color: "black", fontSize: "16px" }}>
						{Account.substring(0, 6).concat(
							"...",
							Account.substring(Account.length - 4, Account.length)
						)}
					</SmallText>
				</>
			) : (
				<Heading
					sx={{
						color: "primary.main",
						fontSize: "20px",
						margin: "0 auto",
					}}
				>
					CONNECT METAMASK WALLET
				</Heading>
			)}
		</Frame>
	);

	if (isBrowser)
		return (
			<>
				{modalOpen &&
					modalState !== "showWallet" &&
					modalState !== "changeAccount" && (
						<ErrorModal setModalOpen={setModalOpen} modalState={modalState} />
					)}
				{modalOpen &&
					(modalState === "showWallet" || modalState === "changeAccount") && (
						<WalletModal
							modalState={modalState}
							setModalOpen={setModalOpen}
							setModalState={setModalState}
						/>
					)}
				<Box
					sx={{
						position: "absolute",
						width: "40%",
						height: "auto",
						left: "30%",
						top: "25%",
						background: "#FFFFFF",
						border: "4px solid #1130FF",
						boxSizing: "border-box",
						display: "flex",
						flexDirection: "column",
						alignContent: "center",
						alignItems: "center",
					}}
				>
					<>
						{MetamaskButton}
						{CENNZnetButton}
						<Button
							variant="outlined"
							size="large"
							disabled={Account && selectedAccount ? false : true}
							sx={{
								width: "50%",
								backgroundColor: "#FFFFFF",
								color: "primary.main",
								m: "45% 0 30px",
								border: "2.5px solid #1130FF",
							}}
							onClick={() => setBridgeState("emery")}
						>
							<Heading sx={{ fontSize: "20px" }}>enter bridge</Heading>
						</Button>
					</>
				</Box>
			</>
		);
	else
		return (
			<Box sx={{ margin: "30% auto", maxWidth: "50%" }}>
				<Heading sx={{ textAlign: "center" }}>
					TO DEPOSIT OR WITHDRAW FROM YOUR WALLET PLEASE USE DESKTOP BROWSER
				</Heading>
			</Box>
		);
};

export default Connect;
