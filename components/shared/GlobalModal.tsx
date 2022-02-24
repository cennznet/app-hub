import React, { useState } from "react";
import { Backdrop, Modal } from "@mui/material";
import { Heading, StyledModal } from "@/components/StyledComponents";

const GlobalModal: React.FC<{}> = ({}) => {
	const [open] = useState(true);
	return (
		<Backdrop
			sx={{
				backgroundColor: "rgba(45, 200, 203, 0.35)",
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
			open={open}
		>
			<Modal open={open}>
				<StyledModal
					sx={{
						position: "relative",
						height: "202px",
						width: "552px",
						justifyContent: "center",
						alignItems: "center",
						display: "flex",
						flexDirection: "column",
						background: "#FFFFFF",
						border: "transparent",
						textAlign: "center",
						top: "50%",
						left: "30%",
						boxShadow:
							"0px 16px 24px rgba(0, 0, 0, 0.14), 0px 6px 30px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.2);",
					}}
				>
					<Heading
						sx={{
							color: "black",
							fontSize: "24px",
							letterSpacing: "1px",
							m: "50px auto 15px",
							maxWidth: "70%",
						}}
					>
						This is the Head
					</Heading>
				</StyledModal>
			</Modal>
		</Backdrop>
	);
};

export default GlobalModal;
