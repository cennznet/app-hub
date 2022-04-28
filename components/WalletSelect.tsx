import { VFC } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useWalletSelect } from "@/providers/WalletSelectProvider";
import CENNZIconSVG from "@/assets/vectors/cennznet-icon.svg";
import MetaMaskIconSVG from "@/assets/vectors/metamask.svg";

const WalletSelect: VFC = () => {
	const { setSelectedWallet } = useWalletSelect();

	return (
		<div css={styles.modalContent}>
			<label htmlFor="select wallet">select wallet</label>
			<div css={styles.selectOptions}>
				<div
					css={[styles.cennzButton, styles.selectOption]}
					onClick={() => setSelectedWallet("CENNZnet")}
				>
					<div css={styles.walletIcon}>
						<img
							src={CENNZIconSVG.src}
							alt="CENNZnet Logo"
							css={styles.selectOptionImg}
						/>
					</div>
					<span>CONNECT CENNZnet</span>
				</div>
				<br />
				<div
					css={[styles.metaMaskButton, styles.selectOption]}
					onClick={() => setSelectedWallet("MetaMask")}
				>
					<div css={styles.walletIcon}>
						<img
							src={MetaMaskIconSVG.src}
							alt="CENNZnet Logo"
							css={styles.selectOptionImg}
						/>
					</div>
					<span>CONNECT METAMASK</span>
				</div>
			</div>
		</div>
	);
};

export default WalletSelect;

const styles = {
	modalContent: ({ palette }: Theme) => css`
		position: absolute;
		top: calc(4em + 48px);
		right: 3em;
		width: 400px;
		background-color: white;
		box-shadow: 4px 8px 8px rgba(17, 48, 255, 0.1);
		border-radius: 4px;
		outline: none;

		label {
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			margin: 1em 1em 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	selectOptions: css`
		text-align: center;
		display: block;
		margin-top: 1em;
	`,

	selectOption: ({ transitions }: Theme) => css`
		margin-bottom: 1em;
		display: inline-flex;
		padding: 0.75em;
		border-radius: 4px;
		height: 50px;

		background-color: white;
		min-width: 240px;
		font-weight: bold;
		cursor: pointer;
		transition: background-color ${transitions.duration.short}ms,
			color ${transitions.duration.short}ms;
	`,

	cennzButton: ({ palette }: Theme) => css`
		align-items: center;
		justify-content: center;
		border: 1px solid ${palette.primary.default};
		color: ${palette.primary.default};
		cursor: pointer;

		&:hover {
			background-color: ${palette.primary.default};
			color: white;
		}
	`,

	metaMaskButton: css`
		align-items: center;
		justify-content: center;
		border: 1px solid #e2761b;
		color: #e2761b;
		cursor: pointer;

		&:hover {
			background-color: #e2761b;
			color: white;
		}
	`,

	selectOptionImg: css`
		display: block;
		width: 28px;
		height: 28px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	`,

	walletIcon: css`
		width: 28px;
		height: 28px;
		margin-right: 0.5em;
		position: relative;
	`,
};
