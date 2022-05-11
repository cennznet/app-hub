import { useCallback, VFC } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useWalletProvider } from "@/providers/WalletProvider";
import CENNZIconSVG from "@/assets/vectors/cennznet-icon.svg";
import MetaMaskIconSVG from "@/assets/vectors/metamask.svg";
import { WalletOption } from "@/types";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";

const WalletSelect: VFC = () => {
	const { setSelectedWallet } = useWalletProvider();
	const { connectWallet: connectCENNZWallet } = useCENNZWallet();
	const { connectWallet: connectMetaMaskWallet } = useMetaMaskWallet();

	const onOptionClick = useCallback(
		(wallet: WalletOption) => {
			setSelectedWallet(wallet);
			if (wallet === "CENNZnet") return connectCENNZWallet();
			if (wallet === "MetaMask") return connectMetaMaskWallet();
		},
		[setSelectedWallet, connectCENNZWallet, connectMetaMaskWallet]
	);

	return (
		<div css={styles.modalContent}>
			<h4 css={styles.selectLabel}>Select Wallet</h4>
			<div css={styles.selectOptions}>
				<div
					css={[styles.metaMaskButton, styles.selectOption]}
					onClick={() => onOptionClick("MetaMask")}
				>
					<img
						src={MetaMaskIconSVG.src}
						alt="CENNZnet Logo"
						css={styles.selectOptionImg}
					/>

					<span>METAMASK</span>
				</div>
				<br />
				<div
					css={[styles.cennzButton, styles.selectOption]}
					onClick={() => onOptionClick("CENNZnet")}
				>
					<img
						src={CENNZIconSVG.src}
						alt="CENNZnet Logo"
						css={styles.selectOptionImg}
					/>

					<span>CENNZnet</span>
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
		padding: 1.5em;
	`,

	selectLabel: ({ palette }: Theme) => css`
		font-weight: bold;
		text-align: center;
		text-transform: uppercase;
		display: block;
		color: ${palette.primary.main};
		margin-top: 0;
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
		margin-right: 0.5em;
	`,
};
