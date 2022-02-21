import React, { useEffect, useState } from "react";
import { Frame, Heading } from "@/components/StyledComponents";
import { useWallet } from "@/providers/SupportedWalletProvider";
import WalletModal from "@/components/shared/WalletModal";

const Wallet: React.FC<{}> = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
	const { selectedAccount, connectWallet } = useWallet();

	useEffect(() => {
		if (selectedAccount) setIsWalletConnected(true);
	}, [selectedAccount]);

	const walletClickHandler: React.EventHandler<React.SyntheticEvent> = (
		event: React.SyntheticEvent
	) => {
		if (isWalletConnected) {
			setModalOpen(true);
		} else {
			connectWallet();
			setModalOpen(true);
			setIsWalletConnected(true);
		}
	};

	return (
		<>
			{modalOpen && <WalletModal setModalOpen={setModalOpen} />}
			<Frame
				sx={{
					"top": "4%",
					"right": "5%",
					"backgroundColor": modalOpen ? "#1130FF" : "#FFFFFF",
					"cursor": "pointer",
					"textAlign": "center",
					"boxShadow": "4px 8px 8px rgba(17, 48, 255, 0.1)",
					"border": "none",
					"width": "228px",
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
				}}
				onClick={walletClickHandler}
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
						textAlign: "center",
						letterSpacing: "1.2px",
						ml: "10px",
					}}
				>
					{isWalletConnected
						? selectedAccount?.meta?.name.substring(0, 17)
						: "CONNECT WALLET"}
				</Heading>
			</Frame>
		</>
	);
};

export default Wallet;
