import { VFC } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useWalletSelect } from "@/providers/WalletSelectProvider";

const WalletSelect: VFC = () => {
	const { setSelectedWallet } = useWalletSelect();

	return (
		<div css={styles.modalContent}>
			<label htmlFor="select wallet">select wallet</label>
			<div>
				<div css={styles.walletActions}>
					<span onClick={() => setSelectedWallet("CENNZnet")}>CENNZnet</span>
				</div>
				<div css={styles.walletActions}>
					<span onClick={() => setSelectedWallet("MetaMask")}>MetaMask</span>
				</div>
			</div>
		</div>
	);
};

export default WalletSelect;

const styles = {
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

	walletActions: ({ palette }: Theme) => css`
		padding: 1em 1.5em 1.5em;
		color: ${palette.grey["700"]};

		> span {
			transition: color 0.2s;
			cursor: pointer;

			&:hover {
				color: ${palette.primary.default};
			}
		}
	`,
};
