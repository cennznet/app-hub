import type { PropsWithChildren } from "@/libs/types";

import { FC } from "react";
import { css } from "@emotion/react";
import { Modal } from "@mui/material";
import { ModalBackdrop } from "@/libs/components";
import { useWalletProvider } from "@/libs/providers/WalletProvider";

interface WalletModalProps extends PropsWithChildren {}

const WalletModal: FC<WalletModalProps> = ({ children }) => {
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

export default WalletModal;

export const styles = {
	modalRoot: css`
		outline: none;
	`,
};
