import React, { useState, useMemo, useCallback } from "react";
import { Frame, Heading } from "@/components/StyledComponents";
import { useWallet } from "@/providers/SupportedWalletProvider";
import WalletModal from "@/components/shared/WalletModal";
import ThreeDots from "@/components/shared/ThreeDots";

type WalletState = "NotConnected" | "Connecting" | "Connected";

const Wallet: React.FC<{}> = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const { selectedAccount, balances, connectWallet } = useWallet();
	const walletState = useMemo<WalletState>(() => {
		if (!selectedAccount) return "NotConnected";
		if (selectedAccount && !balances?.length) return "Connecting";
		return "Connected";
	}, [selectedAccount, balances]);

	const onWalletClick = useCallback(async () => {
		if (walletState === "Connecting") return;
		if (walletState === "Connected") return setModalOpen(true);

		await connectWallet();
	}, [walletState, connectWallet]);

	return (
		<>
			{modalOpen && <WalletModal setModalOpen={setModalOpen} />}
			<Frame
				sx={{
					"top": "3em",
					"right": "3em",
					"backgroundColor": modalOpen ? "#1130FF" : "#FFFFFF",
					"cursor": "pointer",
					"boxShadow": "4px 8px 8px rgba(17, 48, 255, 0.1)",
					"border": "none",
					"width": "230px",
					"height": "48px",
					"display": "flex",
					"alignItems": "center",
					"justifyContent": "flex-start",
					"&:hover": {
						backgroundColor: "#1130FF",
					},
					":hover .headerText": {
						color: "#FFFFFF",
					},
					"borderRadius": "4px",
					"overflow": "hidden",
				}}
				onClick={onWalletClick}
			>
				<img
					style={{ marginLeft: "16px" }}
					src="images/cennznet_blue.svg"
					alt="CENNZnet-log"
				/>
				<Heading
					className={"headerText"}
					sx={{
						fontSize: "16px",
						color: modalOpen ? "#FFFFFF" : "#1130FF",
						whiteSpace: "nowrap",
						marginLeft: "10px",
						textOverflow: "ellipsis",
						overflow: "hidden",
						textTransform: "uppercase",
						flex: 1,
					}}
				>
					{walletState === "Connected" && (
						<span>{selectedAccount?.meta.name}</span>
					)}
					{walletState === "Connecting" && (
						<span>
							Connecting
							<ThreeDots />
						</span>
					)}
					{walletState === "NotConnected" && <span>Connect Wallet</span>}
				</Heading>
			</Frame>
		</>
	);
};

export default Wallet;
