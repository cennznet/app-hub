import React, { useState } from "react";
import { Box, Button, CircularProgress, Modal } from "@mui/material";
import { StyledModal, Heading, Option } from "../../theme/StyledComponents";
import { useWeb3Accounts } from "../../providers/Web3AccountsProvider";
import { useWallet } from "../../providers/SupportedWalletProvider";
import AccountBalances from "./AccountBalances";

const WalletModal: React.FC<{
	setModalOpen: Function;
	setModalState: Function;
	modalState: string;
}> = ({ setModalOpen, setModalState, modalState }) => {
	const [open] = useState(true);
	const { selectAccount, selectedAccount } = useWallet();
	const accounts = useWeb3Accounts();

	const updateAccount = (account) => {
		if (account !== selectedAccount) {
			selectAccount(account);
		}
		setModalState("showWallet");
	};

	return (
		<Modal open={open}>
			<StyledModal
				sx={{
					justifyContent: "center",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box sx={{ display: "flex", mt: "3%", pl: "5%" }}>
					<Heading
						sx={{
							color: "primary.main",
							fontSize: "24px",
						}}
					>
						CENNZnet&nbsp;
					</Heading>
					<Heading
						sx={{
							color: "black",
							fontSize: "24px",
						}}
					>
						WALLET
					</Heading>
				</Box>
				{modalState === "showWallet" ? (
					<>
						{selectedAccount && (
							<AccountBalances selectedAccount={selectedAccount} />
						)}
						<Button
							sx={{
								fontFamily: "Teko",
								fontWeight: "bold",
								fontSize: "21px",
								lineHeight: "124%",
								color: "primary.main",
								width: "40%",
								m: "30px auto 5px",
								display: "flex",
							}}
							size="large"
							variant="outlined"
							onClick={() => setModalState("changeAccount")}
						>
							Change Account
						</Button>
					</>
				) : (
					<>
						<Heading
							sx={{
								m: "3% 0 1.5% 5%",
								color: "primary.main",
								fontSize: "22px",
							}}
						>
							SELECT ACCOUNT
						</Heading>
						{accounts.length ? (
							accounts.map((account, i) => (
								<Option
									sx={{
										width: "85%",
										margin: "0 auto",
										height: "53px",
										display: "flex",
										mb: "10px",
										border: "1px solid",
										backgroundColor:
											account === selectedAccount ? "primary.main" : "#FFFFFF",
									}}
									onClick={() => updateAccount(account)}
									key={i}
								>
									<Heading
										sx={{
											fontSize: "20px",
											textTransform: "uppercase",
											color:
												account === selectedAccount
													? "#FFFFFF"
													: "primary.main",
										}}
										key={account.meta.name}
									>
										{account.meta.name}
									</Heading>
								</Option>
							))
						) : (
							<CircularProgress size="4rem" sx={{ margin: "10px auto 30px" }} />
						)}
					</>
				)}
				<Button
					sx={{
						fontFamily: "Teko",
						fontWeight: "bold",
						fontSize: "21px",
						lineHeight: "124%",
						color: "primary.main",
						width: "40%",
						m: modalState === "showWallet" ? "0 auto 30px" : "10px auto 30px",
						display: "flex",
					}}
					size="large"
					variant="outlined"
					onClick={() => {
						setModalState("");
						setModalOpen(false);
					}}
				>
					CLOSE
				</Button>
			</StyledModal>
		</Modal>
	);
};

export default WalletModal;
