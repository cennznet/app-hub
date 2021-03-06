import { ButtonHTMLAttributes, FC, useCallback, useMemo } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import MetaMaskSVG from "@/libs/assets/vectors/metamask.svg";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useMetaMaskWallet } from "@/libs/providers/MetaMaskWalletProvider";
import { useWalletProvider } from "@/libs/providers/WalletProvider";
import { useSelectedAccount } from "@/libs/hooks";

interface SubmitButtonProps {
	forceRequireMetaMask?: boolean;
}

const SubmitButton: FC<
	ButtonHTMLAttributes<HTMLButtonElement> & SubmitButtonProps
> = ({ children, forceRequireMetaMask, disabled, ...props }) => {
	const { selectedWallet, setWalletOpen } = useWalletProvider();
	const {
		selectedAccount: metaMaskAccount,
		connectWallet: connectMetaMaskWallet,
	} = useMetaMaskWallet();
	const selectedAccount = useSelectedAccount();

	const isConnected = useMemo(
		() => !!selectedWallet || !!selectedAccount,
		[selectedWallet, selectedAccount]
	);

	const isSubmittable = useMemo(
		() => !forceRequireMetaMask || (forceRequireMetaMask && !!metaMaskAccount),
		[forceRequireMetaMask, metaMaskAccount]
	);

	const onConnectWalletClick = useCallback(() => {
		const innerHeight = window.innerHeight;
		const scrollHeight = document.body.scrollHeight;

		if (scrollHeight < innerHeight) return setWalletOpen(true);

		window.scrollTo({ top: 0, behavior: "smooth" });

		setTimeout(() => {
			setWalletOpen(true);
		}, 500);
	}, [setWalletOpen]);

	return (
		<>
			{!isConnected && (
				<button
					type="button"
					css={[styles.root, styles.walletButton]}
					onClick={onConnectWalletClick}
				>
					<AccountBalanceWalletIcon css={styles.brandLogo} />
					CONNECT WALLET
				</button>
			)}

			{isConnected && (
				<>
					{!isSubmittable && (
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
							disabled={disabled}
							{...props}
						>
							{children}
						</button>
					)}
				</>
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

		&:hover:not(:disabled) {
			background-color: ${palette.primary.main};
			color: white;
		}

		&:disabled {
			color: ${palette.grey["500"]};
			border-color: ${palette.grey["500"]};
			cursor: not-allowed;
		}
	`,

	walletButton: ({ palette }: Theme) => css`
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid ${palette.primary.main};
		color: ${palette.primary.main};

		&:hover {
			background-color: ${palette.primary.main};
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
