import React, { useState } from "react";
import { useWallet } from "@/providers/SupportedWalletProvider";
import { Box, Button, Modal } from "@mui/material";
import AccountBalances from "@/components/shared/AccountBalances";

const WalletModal: React.FC<{
	setModalOpen: Function;
}> = ({ setModalOpen }) => {
	const [open] = useState(true);
	const { selectAccount, selectedAccount } = useWallet();

	return (
		<Modal open={open} sx={{ outline: 0 }} onClose={() => setModalOpen(false)}>
			<Box
				sx={{
					position: "absolute",
					top: "calc(4% + 45px + 20px)",
					right: "3em",
					width: "300px",
					height: "auto",
					backgroundColor: "white",
					boxShadow: "4px 8px 8px rgba(17, 48, 255, 0.1)",
					borderRadius: "4px",
					overflow: "hidden",
				}}
			>
				{selectedAccount && (
					<AccountBalances updateSelectedAccount={selectAccount} />
				)}
				<Button
					sx={{
						letterSpacing: "1.2px",
						fontWeight: "bold",
						fontSize: "16",
						lineHeight: "125%",
						color: "primary.main",
						width: "40%",
						m: "15px auto 30px",
						display: "flex",
					}}
					size="large"
					variant="outlined"
					onClick={() => {
						setModalOpen(false);
					}}
				>
					CLOSE
				</Button>
			</Box>
		</Modal>
	);
};

export default WalletModal;
