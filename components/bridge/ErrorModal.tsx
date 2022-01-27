import React, { useState } from "react";
import { Box, Button, Link, Modal } from "@mui/material";
import { StyledModal, Heading, SmallText } from "../../theme/StyledComponents";

const ErrorModal: React.FC<{
	setModalOpen: Function;
	modalState: string;
}> = ({ setModalOpen, modalState }) => {
	const [open] = useState(true);

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
							mb: "15px",
						}}
					>
						ERROR
					</Heading>
				</Box>
				{modalState === "noExtension" && (
					<>
						<SmallText
							sx={{
								ml: "5%",
								display: "inline-flex",
								fontSize: "18px",
								mb: "30px",
							}}
						>
							Please install the CENNZnet extension then refresh page
						</SmallText>
						<Button
							sx={{
								fontFamily: "Teko",
								fontWeight: "bold",
								fontSize: "21px",
								lineHeight: "124%",
								color: "primary.main",
								width: "35%",
								m: "30px auto 0",
								display: "flex",
								textTransform: "none",
							}}
							size="large"
							variant="outlined"
						>
							<Link
								href="https://chrome.google.com/webstore/detail/cennznet-extension/feckpephlmdcjnpoclagmaogngeffafk"
								rel="noopener noreferrer"
								target="blank"
								style={{ textDecoration: "none", color: "#1130FF" }}
							>
								GET CENNZnet
							</Link>
						</Button>
					</>
				)}
				{modalState === "noMetamask" && (
					<>
						<SmallText
							sx={{
								ml: "5%",
								display: "inline-flex",
								fontSize: "18px",
								mb: "30px",
							}}
						>
							Please install the MetaMask extension then refresh page
						</SmallText>
						<Button
							sx={{
								fontFamily: "Teko",
								fontWeight: "bold",
								fontSize: "21px",
								lineHeight: "124%",
								color: "primary.main",
								width: "35%",
								m: "30px auto 0",
								display: "flex",
							}}
							size="large"
							variant="outlined"
						>
							<Link
								href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
								rel="noopener noreferrer"
								target="blank"
								style={{ textDecoration: "none", color: "#1130FF" }}
							>
								Get MetaMask
							</Link>
						</Button>
					</>
				)}
				{modalState === "noAccounts" && (
					<SmallText
						sx={{
							ml: "5%",
							display: "inline-flex",
							fontSize: "18px",
							mb: "30px",
						}}
					>
						Please create an account in the CENNZnet extension
					</SmallText>
				)}

				<Button
					sx={{
						fontFamily: "Teko",
						fontWeight: "bold",
						fontSize: "21px",
						lineHeight: "124%",
						color: "primary.main",
						width: "35%",
						m: modalState === "showWallet" ? "0 auto 30px" : "10px auto 30px",
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
			</StyledModal>
		</Modal>
	);
};

export default ErrorModal;
