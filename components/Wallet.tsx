import React, { useState, useMemo, useCallback } from "react";
import { css } from "@emotion/react";
import { useWallet } from "@/providers/SupportedWalletProvider";
import WalletModal from "@/components/shared/WalletModal";
import ThreeDots from "@/components/shared/ThreeDots";
import AccountIdenticon from "@/components/shared/AccountIdenticon";

type WalletState = "NotConnected" | "Connecting" | "Connected";

const Wallet: React.FC<{}> = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const { selectedAccount, balances, connectWallet } = useWallet();
	const walletState = useMemo<WalletState>(() => {
		if (!selectedAccount) return "NotConnected";
		if (selectedAccount && !balances?.length) return "Connecting";
		return "Connected";
	}, [selectedAccount, balances]);

	const onWalletClick = useCallback(async () => {
		if (walletState === "Connecting") return;
		if (walletState === "Connected") return setModalOpen(true);

		await connectWallet();
		setModalOpen(true);
	}, [walletState, connectWallet]);

	return (
		<>
			<div
				css={[
					styles.walletButton,
					css`
						background-color: ${modalOpen ? "#1130FF" : "#FFFFFF"};
						color: ${modalOpen ? "#FFFFFF !important" : "#1130FF"};
					`,
				]}
				onClick={onWalletClick}
			>
				<div css={styles.walletIcon}>
					<img
						src="images/cennznet_blue.svg"
						alt="CENNZnet-log"
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
					{walletState === "Connected" && (
						<span>{selectedAccount?.meta.name}</span>
					)}
					{walletState === "Connecting" && (
						<span>
							Connecting
							<ThreeDots />
						</span>
					)}
					{walletState === "NotConnected" && <span>Connect CENNZNET</span>}
				</div>
			</div>
			<WalletModal setModalOpen={setModalOpen} modalOpen={modalOpen} />
		</>
	);
};

export default Wallet;

export const styles = {
	walletButton: ({ palette }) => css`
		position: absolute;
		top: 3em;
		right: 3em;
		cursor: pointer;
		box-shadow: 4px 8px 8px rgba(17, 48, 255, 0.1);
		height: 48px;
		display: flex;
		align-items: center;
		transition: background-color 0.2s;
		background-color: white;
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
		text-overflow: ellipisis;
		overflow: hidden;
		text-transform: uppercase;
		flex: 1;
		font-weight: bold;
	`,
};
