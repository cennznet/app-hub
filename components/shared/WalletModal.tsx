import React from "react";
import { css } from "@emotion/react";
import { Modal } from "@mui/material";
import AccountBalances from "@/components/shared/AccountBalances";

const WalletModal: React.FC<{
	modalOpen: boolean;
	setModalOpen: Function;
}> = ({ setModalOpen, modalOpen }) => {
	return (
		<Modal
			open={modalOpen}
			css={styles.modalRoot}
			onClose={() => setModalOpen(false)}
		>
			<div css={styles.modalContent}>
				<AccountBalances setModalOpen={setModalOpen} />
			</div>
		</Modal>
	);
};

export default WalletModal;

export const styles = {
	modalRoot: css`
		outline: none;
	`,

	modalContent: css`
		position: absolute;
		top: calc(4em + 48px);
		right: 3em;
		width: 400px;
		background-color: white;
		box-shadow: 4px 8px 8px rgba(17, 48, 255, 0.1);
		border-radius: 4px;
		outline: none;
	`,
};
