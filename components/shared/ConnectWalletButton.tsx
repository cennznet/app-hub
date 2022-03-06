import React, { FC, MouseEventHandler, useEffect, useState } from "react";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useBridge } from "@/providers/BridgeProvider";
import { Button } from "@mui/material";
import { css } from "@emotion/react";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

interface ConnectWalletButtonProps {
	onClick: () => void;
	buttonText: string;
	requireMetamask: boolean;
	requireCennznet: boolean;
	disabled?: boolean;
	width?: number;
	color?: string;
}

const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
	onClick,
	buttonText,
	requireMetamask,
	requireCennznet,
	disabled,
	width,
	color = "#1130FF",
}) => {
	const [metamaskConnected, setMetamaskConnected] = useState<boolean>(
		!requireMetamask
	);
	const [cennznetConnected, setCennznetConnected] = useState<boolean>(
		!requireCennznet
	);

	const { wallet, connectWallet } = useCENNZWallet();
	const { initBridge, Account }: any = useBridge();

	useEffect(() => {
		if (!Account) return;
		setMetamaskConnected(true);
	}, [Account]);

	useEffect(() => {
		if (!wallet?.signer) return;
		setCennznetConnected(true);
	}, [wallet]);

	const connectMetamask = async () => {
		const { ethereum } = window as any;
		try {
			const accounts = await ethereum.request({
				method: "eth_requestAccounts",
			});
			const ethChainId = await ethereum.request({ method: "eth_chainId" });

			if (ETH_CHAIN_ID === "1" && ethChainId !== "0x1") {
				await ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: "0x1" }],
				});
			} else if (ETH_CHAIN_ID === "42" && ethChainId !== "0x2a") {
				await ethereum.request({
					method: "wallet_switchEthereumChain",
					params: [{ chainId: "0x2a" }],
				});
			}

			initBridge(ethereum, accounts);

			if (!wallet) connectWallet();
			setMetamaskConnected(true);
		} catch (err) {
			console.log(err.message);
		}
	};

	const metamaskButtonComponent = (
		onClick: MouseEventHandler<HTMLDivElement>
	) => {
		return (
			<div css={styles.connectWalletButtonInner} onClick={onClick}>
				<img
					src={"/images/metamask_logo.svg"}
					alt={""}
					width={40}
					height={40}
				/>
				<h1
					style={{
						color: color,
					}}
				>
					Connect Wallet
				</h1>
			</div>
		);
	};

	const cennznetButtonComponent = (
		onClick: MouseEventHandler<HTMLDivElement>
	) => {
		return (
			<div css={styles.connectWalletButtonInner} onClick={onClick}>
				<img src={"images/cennznet_blue.svg"} alt={""} />
				<h1
					style={{
						color: color,
					}}
				>
					Connect Wallet
				</h1>
			</div>
		);
	};

	const defaultButtonComponent = (
		onClick: MouseEventHandler<HTMLButtonElement>,
		buttonText: string,
		disabled: boolean
	) => {
		return (
			<Button
				sx={{
					"opacity": disabled && "0.3",
					"cursor": disabled && "not-allowed",
					"border": `1px solid ${color}`,
					"color": color,
					"fontWeight": "bold",
					"fontSize": "16px",
					"lineHeight": "125%",
					"display": "flex",
					"alignItems": "center",
					"textAlign": "center",
					"letterSpacing": "1.12px",
					"textTransform": "uppercase",
					"&:hover": {
						color: "white",
						backgroundColor: color,
						opacity: "1",
					},
				}}
				onClick={onClick}
				disabled={disabled}
			>
				{buttonText}
			</Button>
		);
	};

	return (
		<div
			css={styles.connectWalletButton}
			style={{
				width: width && cennznetConnected ? width : 216,
				marginBottom: "45px",
				border: `1px solid ${color}`,
			}}
		>
			{metamaskConnected
				? cennznetConnected
					? defaultButtonComponent(onClick, buttonText, disabled)
					: cennznetButtonComponent(async () => await connectWallet())
				: metamaskButtonComponent(connectMetamask)}
		</div>
	);
};

export default ConnectWalletButton;

export const styles = {
	connectWalletButton: css`
		cursor: pointer;
		width: 216px;
		height: 60px;
		min-height: 60px;
		max-height: 60px;
		background: #ffffff;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		button {
			cursor: pointer;
			width: 216px;
			height: 60px;
			min-height: 60px;
			max-height: 60px;
			background: #ffffff;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			align-items: center;
			border-left: transparent;
			border-right: transparent;
			font-weight: bold;
			font-size: 16px;
			line-height: 125%;
			text-align: center;
			letter-spacing: 1.12px;
			text-transform: uppercase;
		}
		h1 {
			font-style: normal;
			font-weight: bold;
			font-size: 16px;
			line-height: 125%;
			display: flex;
			align-items: center;
			text-align: center;
			letter-spacing: 1.12px;
			text-transform: uppercase;
			margin-left: 7px;
		}
	`,
	connectWalletButtonInner: css`
		display: flex;
	`,
};
