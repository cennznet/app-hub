import { ButtonHTMLAttributes, FC, useMemo } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import CENNZBlueSVG from "@/assets/vectors/cennznet-blue.svg";

interface SubmitButtonProps {
	requireCENNZnet: boolean;
	requireMetaMask: boolean;
}

const SubmitButton: FC<
	ButtonHTMLAttributes<HTMLButtonElement> & SubmitButtonProps
> = ({ children, requireCENNZnet, requireMetaMask, ...props }) => {
	const { selectedAccount, connectWallet } = useCENNZWallet();

	const isSubmittable = useMemo(() => {
		if (requireCENNZnet && !selectedAccount) return false;

		if (requireMetaMask) return false;

		return true;
	}, [requireCENNZnet, selectedAccount, requireMetaMask]);

	return (
		<>
			{!selectedAccount && requireCENNZnet && (
				<button
					type="button"
					css={[styles.root, styles.cennzButton]}
					onClick={() => connectWallet()}
				>
					<img
						src={CENNZBlueSVG.src}
						alt="CENNZnet Logo"
						css={styles.cennzLogo}
					/>
					CONNECT CENNZnet
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
	root: ({ palette, transitions }: Theme) => css`
		display: inline-block;
		padding: 0.75em;
		border-radius: 4px;
		border: 1px solid ${palette.primary.main};
		color: ${palette.primary.main};
		background-color: white;
		min-width: 240px;
		font-weight: bold;
		cursor: pointer;
		transition: background-color ${transitions.duration.short}ms,
			color ${transitions.duration.short}ms;

		&:hover {
			background-color: ${palette.primary.main};
			color: white;
		}
	`,

	submitButton: css`
		text-align: center;
		text-transform: uppercase;
	`,

	cennzButton: css`
		display: inline-flex;
		align-items: center;
		justify-content: center;
	`,

	cennzLogo: css`
		width: 28px;
		margin-right: 0.5em;
	`,
};
