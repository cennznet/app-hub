import { FC, memo, PropsWithChildren } from "react";
import { css } from "@emotion/react";
import { Modal } from "@mui/material";
import { ModalBackdrop } from "@components";
import { useWalletProvider } from "@providers/WalletProvider";

interface WalletModalProps {}

const WalletModal: FC<PropsWithChildren<WalletModalProps>> = ({ children }) => {
	const { walletOpen, setWalletOpen } = useWalletProvider();

	const closeWallet = () => setWalletOpen(false);

	return (
		<Modal
			open={walletOpen}
			css={styles.modalRoot}
			BackdropComponent={ModalBackdrop}
			onClose={closeWallet}
		>
			<div>{children}</div>
		</Modal>
	);
};

export default memo(WalletModal);

export const styles = {
	modalRoot: css`
		outline: none;
	`,
};
