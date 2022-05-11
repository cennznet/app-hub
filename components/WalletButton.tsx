import React, { useMemo } from "react";
import { css } from "@emotion/react";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import WalletModal from "@/components/WalletModal";
import AccountIdenticon from "@/components/shared/AccountIdenticon";
import CENNZIconSVG from "@/assets/vectors/cennznet-icon.svg";
import { Theme } from "@mui/material";
import WalletSelect from "@/components/WalletSelect";
import Wallet from "@/components/Wallet";
import { useWalletProvider } from "@/providers/WalletProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";

type WalletState = "Connected" | "NotConnected";

const WalletButton: React.FC = () => {
	const { walletOpen, setWalletOpen, selectedWallet } = useWalletProvider();
	const { selectedAccount: cennzAccount } = useCENNZWallet();
	const { selectedAccount: metaMaskAccount } = useMetaMaskWallet();

	const walletState = useMemo<WalletState>(() => {
		if (!!selectedWallet) return "Connected";
		if (!cennzAccount || !metaMaskAccount) return "NotConnected";
	}, [cennzAccount, metaMaskAccount, selectedWallet]);

	return (
		<>
			<div
				css={styles.walletButton(walletOpen)}
				onClick={() => setWalletOpen(true)}
			>
				<div css={styles.walletIcon}>
					{(walletState === "NotConnected" || !selectedWallet) && (
						<img
							src={CENNZIconSVG.src}
							alt="CENNZnet Logo"
							css={styles.walletIconImg}
						/>
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
					{walletState === "Connected" && selectedWallet === "CENNZnet" && (
						<span>{cennzAccount?.meta?.name?.toUpperCase?.()}</span>
					)}
					{walletState === "Connected" && selectedWallet === "MetaMask" && (
						<span>
							{metaMaskAccount?.address
								.slice(0, 6)
								.concat("...", metaMaskAccount?.address.slice(-4))}
						</span>
					)}
					{!selectedWallet && <span>CONNECT WALLET</span>}
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
				background-color: ${walletOpen ? palette.primary.default : "#FFFFFF"};
				color: ${walletOpen ? "#FFFFFF !important" : palette.primary.default};
				transition: background-color ${transitions.duration.short}ms,
					color ${transitions.duration.short}ms;
				border-radius: 4px;
				overflow: hidden;
				padding: 1em;
				max-width: 240px;

				&:hover {
					background-color: ${palette.primary.default};
					color: white;
				}
			`,

	walletIcon: css`
		width: 28px;
		height: 28px;
		margin-right: 0.5em;
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
