import { ButtonHTMLAttributes, FC, useMemo } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import CENNZBlueSVG from "@/assets/vectors/cennznet-blue.svg";
import MetaMaskSVG from "@/assets/vectors/metamask.svg";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";

interface SubmitButtonProps {
	requireCENNZnet: boolean;
	requireMetaMask: boolean;
}

const SubmitButton: FC<
	ButtonHTMLAttributes<HTMLButtonElement> & SubmitButtonProps
> = ({ children, requireCENNZnet, requireMetaMask, ...props }) => {
	const { selectedAccount: cennzAccount, connectWallet: connectCENNZWallet } =
		useCENNZWallet();
	const {
		selectedAccount: metaMaskAccount,
		connectWallet: connectMetaMaskWallet,
	} = useMetaMaskWallet();

	const isSubmittable = useMemo(() => {
		if (requireCENNZnet && !cennzAccount) return false;

		if (requireMetaMask && !metaMaskAccount) return false;

		return true;
	}, [requireCENNZnet, cennzAccount, requireMetaMask, metaMaskAccount]);

	return (
		<>
			{!cennzAccount && requireCENNZnet && (
				<button
					type="button"
					css={[styles.root, styles.cennzButton]}
					onClick={() => connectCENNZWallet()}
				>
					<img
						src={CENNZBlueSVG.src}
						alt="CENNZnet Logo"
						css={styles.brandLogo}
					/>
					CONNECT CENNZnet
				</button>
			)}

			{!metaMaskAccount && requireMetaMask && !!cennzAccount && (
				<button
					type="button"
					css={[styles.root, styles.metaMaskButton]}
					onClick={() => connectMetaMaskWallet()}
				>
					<img
						src={MetaMaskSVG.src}
						alt="MetaMask Logo"
						css={styles.brandLogo}
					/>
					CONNECT METAMASK
				</button>
			)}

			{isSubmittable && (
				<button
					css={[styles.root, styles.submitButton]}
					type="submit"
					{...props}
				>
					{children}
				</button>
			)}
		</>
	);
};

export default SubmitButton;

const styles = {
	root: ({ transitions }: Theme) => css`
		display: inline-block;
		padding: 0.75em;
		border-radius: 4px;

		background-color: white;
		min-width: 240px;
		font-weight: bold;
		cursor: pointer;
		transition: background-color ${transitions.duration.short}ms,
			color ${transitions.duration.short}ms;
	`,

	submitButton: ({ palette }: Theme) => css`
		text-align: center;
		text-transform: uppercase;
		border: 1px solid ${palette.primary.main};
		color: ${palette.primary.main};

		&:hover {
			background-color: ${palette.primary.main};
			color: white;
		}
	`,

	cennzButton: ({ palette }: Theme) => css`
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid ${palette.primary.default};
		color: ${palette.primary.default};

		&:hover {
			background-color: ${palette.primary.default};
			color: white;
		}
	`,

	metaMaskButton: css`
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid #e2761b;
		color: #e2761b;

		&:hover {
			background-color: #e2761b;
			color: white;
		}
	`,

	brandLogo: css`
		width: 28px;
		margin-right: 0.5em;
	`,
};
