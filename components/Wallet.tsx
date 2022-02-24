import React, { useState } from "react";
import { Frame, Heading } from "@/components/StyledComponents";
import { useWallet } from "@/providers/SupportedWalletProvider";
import WalletModal from "@/components/shared/WalletModal";

const Wallet: React.FC<{}> = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const { selectedAccount } = useWallet();

	return (
		<>
			{modalOpen && <WalletModal setModalOpen={setModalOpen} />}
			<Frame
				sx={{
					"top": "3em",
					"right": "3em",
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
					"borderRadius": "4px",
					"overflow": "hidden",
				}}
				onClick={() => setModalOpen(true)}
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
						textOverflow: "ellipsis",
						overflow: "hidden",
					}}
				>
					{selectedAccount?.meta.name || "CONNECT WALLET"}
				</Heading>
			</Frame>
		</>
	);
};

export default Wallet;
