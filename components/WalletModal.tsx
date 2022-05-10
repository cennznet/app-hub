import { FC } from "react";
import { css } from "@emotion/react";
import { Modal } from "@mui/material";
import ModalBackdrop from "@/components/shared/ModalBackdrop";
import { useWalletProvider } from "@/providers/WalletProvider";

const WalletModal: FC = ({ children }) => {
	const { walletOpen, setWalletOpen } = useWalletProvider();

	const closeWallet = () => setWalletOpen(false);

	return (
		<Modal
			open={walletOpen}
			css={styles.modalRoot}
			BackdropComponent={ModalBackdrop}
			onBackdropClick={closeWallet}
			onClose={closeWallet}
		>
			<div>{children}</div>
		</Modal>
	);
};

export default WalletModal;

export const styles = {
	modalRoot: css`
		outline: none;
	`,
};
