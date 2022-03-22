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

	cennzLogo: css`
		width: 28px;
		margin-right: 0.5em;
	`,
};
