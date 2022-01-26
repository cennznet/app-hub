import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isBrowser, isTablet } from "react-device-detect";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Frame, Heading, SmallText } from "../../theme/StyledComponents";
import { useBlockchain } from "../../providers/BlockchainProvider";
import { useWallet } from "../../providers/SupportedWalletProvider";
import Switch from "../../components/bridge/Switch";
import Deposit from "../../components/bridge/Deposit";
import Withdraw from "../../components/bridge/Withdraw";
import WalletModal from "../../components/bridge/WalletModal";

const Emery: React.FC<{}> = () => {
	const router = useRouter();
	const [isDeposit, toggleIsDeposit] = useState<boolean>(true);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [modalState, setModalState] = useState<string>("");
	const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
	const { selectedAccount, connectWallet } = useWallet();
	const { updateNetwork, Account } = useBlockchain();

	useEffect(() => {
		const { ethereum }: any = window;
		const ethereumNetwork = window.localStorage.getItem("ethereum-network");

		let network: string;
		switch (ethereumNetwork) {
			case "Mainnet":
				network = "Mainnet/Mainnet";
				break;
			case "Ropsten":
				network = "Ropsten/Rata";
				break;
			case "Kovan":
				network = "Kovan/Nikau";
				break;
			default:
				router.push("/bridge");
				break;
		}

		if (ethereumNetwork) {
			updateNetwork(ethereum, ethereumNetwork);
			if (!isWalletConnected) connectWallet();
		}
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		selectedAccount ? setIsWalletConnected(true) : setIsWalletConnected(false);
	}, [selectedAccount]);

	const walletClickHandler: React.EventHandler<React.SyntheticEvent> = (
		event: React.SyntheticEvent
	) => {
		if (isWalletConnected) {
			setModalState("showWallet");
			setModalOpen(true);
		} else {
			connectWallet();
			setModalState("changeAccount");
			setModalOpen(true);
		}
	};

	return (
		<>
			{modalOpen &&
				(modalState === "showWallet" || modalState === "changeAccount") && (
					<WalletModal
						modalState={modalState}
						setModalOpen={setModalOpen}
						setModalState={setModalState}
					/>
				)}
			<Typography
				sx={{
					position: "absolute",
					top: "4.5%",
					left: isBrowser ? "16%" : "25%",
					fontFamily: "Teko",
					fontStyle: "normal",
					fontWeight: "bold",
					fontSize: isBrowser || isTablet ? "24px" : "16px",
					lineHeight: "124%",
					color: "black",
					letterSpacing: "1px",
				}}
			>
				ETHEREUM BRIDGE
			</Typography>
			<Switch isDeposit={isDeposit} toggleIsDeposit={toggleIsDeposit} />
			<Frame
				sx={{
					top: "12%",
					right: "5%",
					backgroundColor:
						modalState === "showWallet" || modalState === "changeAccount"
							? "#1130FF"
							: "#FFFFFF",
					cursor: "pointer",
				}}
				onClick={walletClickHandler}
			>
				<img src="wallet.svg" alt="CENNZnet-wallet" />
				<Heading
					sx={{
						ml: "5px",
						mt: "3px",
						fontSize: "20px",
						color:
							modalState === "showWallet" || modalState === "changeAccount"
								? "#FFFFFF"
								: "#1130FF",
						flexGrow: 1,
						whiteSpace: "nowrap",
					}}
				>
					CENNZnet
				</Heading>
				{selectedAccount && (
					<SmallText
						sx={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							ml: "1.5px",
							fontSize: "15px",
							color:
								modalState === "showWallet" || modalState === "changeAccount"
									? "#FFFFFF"
									: "black",
						}}
					>
						{selectedAccount.meta.name}
					</SmallText>
				)}
			</Frame>
			<Frame
				sx={{
					top: "20%",
					right: "5%",
					backgroundColor: "#FFFFFF",
					cursor: "copy",
				}}
				onClick={() => navigator.clipboard.writeText(Account)}
			>
				{Account && (
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
				)}
			</Frame>
			{isDeposit ? <Deposit /> : <Withdraw />}
		</>
	);
};

export default Emery;
