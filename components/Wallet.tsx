import React, { useState, useMemo, useCallback } from "react";
import { css } from "@emotion/react";
import { Frame } from "@/components/StyledComponents";
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
	}, [walletState, connectWallet]);

	return (
		<>
			{modalOpen && (
				<WalletModal setModalOpen={setModalOpen} modalOpen={modalOpen} />
			)}
			<Frame
				sx={{
					"top": "3em",
					"right": "3em",
					"backgroundColor": modalOpen ? "#1130FF" : "#FFFFFF",
					"cursor": "pointer",
					"boxShadow": "4px 8px 8px rgba(17, 48, 255, 0.1)",
					"border": "none",
					"width": "230px",
					"height": "48px",
					"display": "flex",
					"alignItems": "center",
					"justifyContent": "flex-start",
					"&:hover": {
						backgroundColor: "#1130FF",
					},
					"&:hover .headerText": {
						color: "#FFFFFF",
					},
					"borderRadius": "4px",
					"overflow": "hidden",
				}}
				onClick={onWalletClick}
			>
				<div css={styles.walletIcon}>
					<img
						src="images/cennznet_blue.svg"
						alt="CENNZnet-log"
						css={styles.walletIconImg}
					/>

					{walletState === "Connected" && (
						<AccountIdenticon
							css={styles.walletIconIdenticon}
							theme="beachball"
							size={28}
							value={selectedAccount.address}
						/>
					)}
				</div>
				<div
					className={"headerText"}
					css={css`
						font-size: 16px;
						color: ${modalOpen ? "#FFFFFF" : "#1130FF"};
						white-space: nowrap;
						margin-left: 0.5em;
						text-overflow: ellipsis;
						overflow: hidden;
						text-transform: uppercase;
						flex: 1;
						font-weight: bold;
					`}
				>
					{walletState === "Connected" && (
						<span>{selectedAccount?.meta.name}</span>
					)}
					{walletState === "Connecting" && (
						<span>
							Connecting
							<ThreeDots />
						</span>
					)}
					{walletState === "NotConnected" && <span>Connect Wallet</span>}
				</div>
			</Frame>
		</>
	);
};

export default Wallet;

export const styles = {
	walletIcon: css`
		width: 28px;
		height: 28px;
		margin-left: 16px;
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
};
