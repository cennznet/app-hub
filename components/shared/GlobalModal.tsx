import React, { useEffect, useState } from "react";
import { Backdrop, Modal } from "@mui/material";
import { css } from "@emotion/react";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";

interface GlobalModalProps {
	isOpen: boolean;
	setModalOpened: Function;
	title: string;
	buttonText: string;
	disableButton: boolean;
	message: string | JSX.Element;
	callback?: Function;
}

const GlobalModal: React.FC<GlobalModalProps> = ({
	isOpen,
	setModalOpened,
	title,
	buttonText,
	message,
	callback,
	disableButton = false,
}) => {
	const theme = useTheme();
	const router = useRouter();

	return (
		<Backdrop
			sx={{
				backgroundColor:
					theme.palette.secondary[router.asPath.replace("/", "")],
				zIndex: (theme) => theme.zIndex.drawer + 1,
			}}
			open={isOpen}
			onClick={() => {
				if (!disableButton) setModalOpened(false);
			}}
		>
			<Modal open={isOpen}>
				<div css={styles.styledModal}>
					<div css={styles.contentContainer}>
						<h1 css={styles.header}>{title}</h1>
						<p css={styles.infoText}>{message}</p>
						<button
							disabled={disableButton}
							onClick={() => {
								if (callback) callback();
								else setModalOpened(false);
							}}
							css={styles.confirmButton}
						>
							{buttonText ? buttonText : "Close"}
						</button>
					</div>
				</div>
			</Modal>
		</Backdrop>
	);
};

export default GlobalModal;

export const styles = {
	styledModal: css`
		position: absolute;
		height: auto;
		width: 550px;
		justify-content: center;
		align-items: center;
		display: flex;
		flex-direction: column;
		background: #ffffff;
		border: transparent;
		text-align: center;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);

		box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.14),
			0px 6px 30px rgba(0, 0, 0, 0.12), 0px 8px 10px rgba(0, 0, 0, 0.2);
	`,
	contentContainer: css`
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		width: 100%;
		height: 100%;
		padding: 18px 24px 18px 24px;
	`,
	header: css`
		font-style: normal;
		font-weight: bold;
		font-size: 24px;
		line-height: 24px;
		letter-spacing: 0.15px;
		color: #1130ff;
	`,
	infoText: css`
		text-align: left;
		margin: 0;
	`,
	confirmButton: css`
		cursor: pointer;
		height: 40px;
		width: 120px;
		font-family: Roboto;
		font-style: normal;
		font-weight: 500;
		font-size: 14px;
		line-height: 16px;
		color: #1130ff;
		letter-spacing: 1.25px;
		text-transform: uppercase;
		align-self: flex-end;
		border: 1px solid #1130ff;
		background: transparent;
		margin-top: 18px;
		&:hover {
			background: #1130ff;
			color: white;
		}
		&:disabled {
			cursor: not-allowed;
			opacity: 0.3;
		}
	`,
};
