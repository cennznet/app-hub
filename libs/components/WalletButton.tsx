import React, { FC, useMemo } from "react";
import { css } from "@emotion/react";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Theme } from "@mui/material";
import {
	WalletModal,
	AccountIdenticon,
	WalletSelect,
	Wallet,
} from "@/libs/components";
import { useWalletProvider } from "@/libs/providers/WalletProvider";
import { useMetaMaskWallet } from "@/libs/providers/MetaMaskWalletProvider";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

type WalletState = "Connected" | "Connecting" | "NotConnected";

const WalletButton: FC = () => {
	const { walletOpen, setWalletOpen, selectedWallet } = useWalletProvider();
	const { selectedAccount: cennzAccount } = useCENNZWallet();
	const { selectedAccount: metaMaskAccount } = useMetaMaskWallet();

	const walletState = useMemo<WalletState>(() => {
		if (selectedWallet === "CENNZnet")
			return cennzAccount?.address ? "Connected" : "Connecting";

		if (selectedWallet === "MetaMask")
			return metaMaskAccount?.address ? "Connected" : "Connecting";

		return "NotConnected";
	}, [cennzAccount?.address, metaMaskAccount?.address, selectedWallet]);

	return (
		<>
			<div
				css={styles.walletButton(walletOpen)}
				onClick={() => setWalletOpen(true)}
			>
				<div css={styles.walletIcon}>
					{walletState !== "Connected" && (
						<AccountBalanceWalletIcon css={styles.walletIconImg} />
					)}

					{!!cennzAccount?.address && selectedWallet === "CENNZnet" && (
						<AccountIdenticon
							css={styles.walletIconIdenticon}
							theme="beachball"
							size={28}
							value={cennzAccount.address}
						/>
					)}
					{!!metaMaskAccount?.address && selectedWallet === "MetaMask" && (
						<Jazzicon
							diameter={28}
							seed={jsNumberForAddress(metaMaskAccount?.address as string)}
						/>
					)}
				</div>

				<div css={styles.walletState}>
					{walletState === "Connected" && (
						<>
							{selectedWallet === "CENNZnet" && (
								<span>{cennzAccount?.meta?.name?.toUpperCase?.()}</span>
							)}

							{selectedWallet === "MetaMask" && (
								<span>
									{metaMaskAccount?.address
										.slice(0, 6)
										.concat("...", metaMaskAccount?.address.slice(-4))}
								</span>
							)}
						</>
					)}

					{walletState === "Connecting" && <span>CONNECTING...</span>}

					{walletState === "NotConnected" && <span>CONNECT WALLET</span>}
				</div>
			</div>
			<WalletModal>
				{!selectedWallet && <WalletSelect />}
				{selectedWallet && <Wallet />}
			</WalletModal>
		</>
	);
};

export default WalletButton;

export const styles = {
	walletButton:
		(walletOpen: boolean) =>
		({ palette, shadows, transitions }: Theme) =>
			css`
				position: absolute;
				top: 0;
				right: 3em;
				cursor: pointer;
				box-shadow: ${shadows[1]};
				height: 48px;
				display: flex;
				align-items: center;
				background-color: ${walletOpen ? palette.primary.main : "#FFFFFF"};
				color: ${walletOpen ? "#FFFFFF !important" : palette.primary.main};
				transition: background-color ${transitions.duration.short}ms,
					color ${transitions.duration.short}ms;
				border-radius: 4px;
				overflow: hidden;
				padding: 1em;
				max-width: 240px;

				&:hover {
					background-color: ${palette.primary.main};
					color: white;
				}
			`,

	walletIcon: css`
		width: 28px;
		height: 28px;
		margin-right: 0.75em;
		position: relative;
	`,

	walletIconImg: css`
		display: block;
		width: 28px;
		height: 28px;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	`,

	walletIconIdenticon: css`
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	`,

	walletState: css`
		font-size: 16px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		flex: 1;
		font-weight: bold;
	`,
};
