import React, { useState } from "react";
import { Box } from "@mui/material";
import { SwitchButton } from "@/theme/StyledComponents";
import { useWallet } from "@/providers/SupportedWalletProvider";
import ErrorModal from "@/components/bridge/ErrorModal";

const Switch: React.FC<{ isDeposit: Boolean; toggleIsDeposit: Function }> = ({
	isDeposit,
	toggleIsDeposit,
}) => {
	const [modalState, setModalState] = useState<string>();
	const [modalOpen, setModalOpen] = useState<boolean>();
	const { selectedAccount } = useWallet();

	const checkCENNZnetAccount = () => {
		if (!selectedAccount) {
			setModalState("connectCENNZ");
			setModalOpen(true);
		} else {
			toggleIsDeposit(false);
		}
	};

	return (
		<>
			{modalOpen && (
				<ErrorModal modalState={modalState} setModalOpen={setModalOpen} />
			)}
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					marginTop: "9%",
				}}
			>
				{isDeposit ? (
					<>
						<SwitchButton
							style={{
								left: "calc(50% - 276px/2 - 138px)",
								top: "0%",
								bottom: "0%",
								backgroundColor: "#1130FF",
								color: "#FFFFFF",
								borderBottom: "none",
							}}
						>
							Deposit
						</SwitchButton>
						<SwitchButton
							onClick={checkCENNZnetAccount}
							style={{
								backgroundColor: "#FFFFFF",
								color: "#1130FF",
								borderBottom: "none",
							}}
						>
							Withdraw
						</SwitchButton>
					</>
				) : (
					<>
						<SwitchButton
							onClick={() => toggleIsDeposit(true)}
							style={{
								left: "calc(50% - 276px/2 - 138px)",
								backgroundColor: "#FFFFFF",
								borderBottom: "none",
								color: "#1130FF",
							}}
						>
							Deposit
						</SwitchButton>
						<SwitchButton
							style={{
								backgroundColor: "#1130FF",
								borderBottom: "none",
								color: "#FFFFFF",
							}}
						>
							Withdraw
						</SwitchButton>
					</>
				)}
			</Box>
		</>
	);
};

export default Switch;
