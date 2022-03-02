import { Modal } from "@mui/material";
import { css } from "@emotion/react";
import { Link } from "@mui/material";
import ThreeDots from "@/components/shared/ThreeDots";
import ModalBackdrop from "@/components/shared/ModalBackdrop";

interface GlobalModalProps {
	isOpen: boolean;
	setModalOpened: Function;
	title: string;
	message: string | JSX.Element;
	disableButton?: boolean;
	buttonLink?: string;
	buttonText?: string;
	callback?: Function;
	loading?: boolean;
}

const GlobalModal: React.FC<GlobalModalProps> = ({
	isOpen,
	setModalOpened,
	title,
	buttonText,
	buttonLink,
	message,
	callback,
	loading,
	disableButton = false,
}) => {
	return (
		<Modal
			open={isOpen}
			BackdropComponent={ModalBackdrop}
			onBackdropClick={() => {
				if (!disableButton) setModalOpened(false);
			}}
		>
			<div css={styles.styledModal}>
				<div css={styles.contentContainer}>
					<div css={styles.headerContainer}>
						<h1 css={styles.header}>{title}</h1>
						{loading && <ThreeDots rootCss={styles.threeDots} />}
					</div>
					<p css={styles.infoText}>{message}</p>
					{buttonLink ? (
						<Link
							css={styles.linkedButton}
							href={buttonLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							<button
								disabled={disableButton}
								onClick={() => {
									if (callback) callback();
								}}
								css={styles.confirmButton}
							>
								{buttonText ? buttonText : "Close"}
							</button>
						</Link>
					) : (
						<button
							disabled={disableButton}
							onClick={() => {
								if (callback) callback();
								setModalOpened(false);
							}}
							css={styles.confirmButton}
						>
							{buttonText ? buttonText : "Close"}
						</button>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default GlobalModal;

export const styles = {
	styledModal: css`
		border-radius: 4px;
		outline: none;
		position: absolute;
		height: auto;
		width: 600px;
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
	headerContainer: css`
		display: flex;
		justify-content: center;
		align-items: center;
	`,
	header: css`
		font-style: normal;
		font-weight: bold;
		font-size: 24px;
		line-height: 24px;
		letter-spacing: 0.15px;
		color: #1130ff;
	`,
	threeDots: css`
		font-size: 24px;
	`,
	infoText: css`
		text-align: left;
		margin: 0;
	`,
	linkedButton: css`
		align-self: flex-end;
	`,
	confirmButton: css`
		cursor: pointer;
		height: 40px;
		width: auto;
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
