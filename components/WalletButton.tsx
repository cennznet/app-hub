import React, { useState, useMemo, useCallback } from "react";
import { css } from "@emotion/react";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import WalletModal from "@/components/WalletModal";
import AccountIdenticon from "@/components/shared/AccountIdenticon";
import CENNZBlueSVG from "@/assets/vectors/cennznet-blue.svg";
import { Theme } from "@mui/material";

type WalletState = "NotConnected" | "Connecting" | "Connected";

const WalletButton: React.FC<{}> = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const { selectedAccount, balances, connectWallet } = useCENNZWallet();
	const walletState = useMemo<WalletState>(() => {
		if (!selectedAccount) return "NotConnected";
		if (selectedAccount && !balances?.length) return "Connecting";
		return "Connected";
	}, [selectedAccount, balances]);

	const onWalletClick = useCallback(async () => {
		if (walletState !== "NotConnected") return setModalOpen(true);

		await connectWallet();
		setModalOpen(true);
	}, [walletState, connectWallet]);

	return (
		<>
			<div css={styles.walletButton(modalOpen)} onClick={onWalletClick}>
				<div css={styles.walletIcon}>
					<img
						src={CENNZBlueSVG.src}
						alt="CENNZnet Logo"
						css={styles.walletIconImg}
					/>

					{!!selectedAccount?.address && (
						<AccountIdenticon
							css={styles.walletIconIdenticon}
							theme="beachball"
							size={28}
							value={selectedAccount.address}
						/>
					)}
				</div>
				<div css={styles.walletState}>
					{walletState !== "NotConnected" && (
						<span>{selectedAccount?.meta?.name?.toUpperCase?.()}</span>
					)}
					{walletState === "NotConnected" && <span>CONNECT CENNZnet</span>}
				</div>
			</div>
			<WalletModal setModalOpen={setModalOpen} modalOpen={modalOpen} />
		</>
	);
};

export default WalletButton;

export const styles = {
	walletButton:
		(modalOpen: boolean) =>
		({ palette, shadows, transitions }: Theme) =>
			css`
				position: absolute;
				top: 3em;
				right: 3em;
				cursor: pointer;
				box-shadow: ${shadows[1]};
				height: 48px;
				display: flex;
				align-items: center;
				background-color: ${modalOpen ? palette.primary.default : "#FFFFFF"};
				color: ${modalOpen ? "#FFFFFF !important" : palette.primary.default};
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
