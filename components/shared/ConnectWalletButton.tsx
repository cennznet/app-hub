import React, { FC, useEffect, useState } from "react";
import styles from "../../styles/components/shared/connectwalletbutton.module.css";
import { useWallet } from "../../providers/SupportedWalletProvider";
import { useBlockchain } from "../../providers/BlockchainProvider";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

interface ConnectWalletButtonProps {
	onClick: () => void;
	buttonText: string;
	requireMetamask: boolean;
	requireCennznet: boolean;
	disabled?: boolean;
}

const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
	onClick,
	buttonText,
	requireMetamask,
	requireCennznet,
	disabled,
}) => {
	const [metamaskConnected, setMetamaskConnected] = useState<boolean>(
		!requireMetamask
	);
	const [cennznetConnected, setCennznetConnected] = useState<boolean>(
		!requireCennznet
	);

	const { wallet, connectWallet } = useWallet();
	const { initBlockchain }: any = useBlockchain();

	useEffect(() => {
		if (wallet?.signer) setCennznetConnected(true);
	}, [wallet?.signer]);

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

			initBlockchain(ethereum, accounts);

			if (!wallet) connectWallet();
			setMetamaskConnected(true);
		} catch (err) {
			console.log(err.message);
		}
	};

	const metamaskButtonComponent = (onClick: Function) => {
		return (
			<div
				className={styles.connectWalletButtonInner}
				onClick={() => {
					onClick();
				}}
			>
				<img src={"metamask_logo.svg"} alt={""} width={40} height={40} />
				<h1>Connect Wallet</h1>
			</div>
		);
	};

	const cennznetButtonComponent = (onClick: Function) => {
		return (
			<div
				className={styles.connectWalletButtonInner}
				onClick={() => {
					onClick();
				}}
			>
				<img src={"images/cennznet_blue.svg"} alt={""} />
				<h1>Connect Wallet</h1>
			</div>
		);
	};

	const defaultButtonComponent = (
		onClick: Function,
		buttonText: string,
		disabled: boolean
	) => {
		return (
			<button
				style={{
					opacity: disabled && "0.3",
					cursor: disabled && "not-allowed",
				}}
				type={"button"}
				onClick={() => {
					onClick();
				}}
				disabled={disabled}
			>
				{buttonText}
			</button>
		);
	};

	return (
		<div className={styles.connectWalletButton}>
			{metamaskConnected
				? cennznetConnected
					? defaultButtonComponent(onClick, buttonText, disabled)
					: cennznetButtonComponent(connectWallet)
				: metamaskButtonComponent(connectMetamask)}
		</div>
	);
};

export default ConnectWalletButton;
