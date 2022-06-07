import {
	Theme,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { css } from "@emotion/react";
import { StandardButton, ModalBackdrop } from "@/libs/components";
import { FC } from "react";

interface GlobalModalProps {
	isOpen: boolean;
	onRequestClose: () => void;
	title: string;
	message: string | JSX.Element;
	actions?: string | JSX.Element;
	shouldCloseOnEsc?: boolean;
	shouldCloseOnOverlayClick?: boolean;
}

const GlobalModal: FC<GlobalModalProps> = ({
	isOpen,
	title,
	message,
	actions,
	onRequestClose,
	shouldCloseOnEsc,
}) => {
	const dialogActions =
		!actions || typeof actions === "string" ? (
			<StandardButton onClick={onRequestClose}>
				{actions || "Okay"}
			</StandardButton>
		) : (
			actions
		);

	return (
		<Dialog
			open={isOpen}
			BackdropComponent={ModalBackdrop}
			css={styles.root}
			onClose={onRequestClose}
			disableEscapeKeyDown={!shouldCloseOnEsc}
			PaperProps={{ sx: styles.modal as any }}
		>
			<DialogTitle css={styles.modalTitle}>{title}</DialogTitle>

			<DialogContent>{message}</DialogContent>

			<DialogActions css={styles.modalActions}>{dialogActions}</DialogActions>
		</Dialog>
	);
};

export default GlobalModal;

export const styles = {
	root: css`
		backdrop-filter: blur(2px);
	`,

	modal: css`
		border-radius: 4px;
		overflow: hidden;
		width: 600px;
	`,

	modalTitle: ({ palette }: Theme) => css`
		color: ${palette.primary.default};
	`,

	modalActions: ({ palette }: Theme) => css`
		padding: 1em;
		border-top: 1px solid ${palette.text.disabled};
		flex-direction: row-reverse;
		justify-content: flex-start;
	`,
};
