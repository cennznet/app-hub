import { useBridge } from "@/libs/providers/BridgeProvider";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { useMetaMaskWallet } from "@/libs/providers/MetaMaskWalletProvider";
import { BridgeStatus } from "@/libs/types";
import {
	fetchBridgeDepositStatus,
	fetchBridgeWithdrawStatus,
} from "@/libs/utils";
import { useEffect, useState } from "react";
import { useWalletProvider } from "@/libs/providers/WalletProvider";

export default function useBridgeStatus(): BridgeStatus {
	const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>("Active");
	const { api } = useCENNZApi();
	const { wallet } = useMetaMaskWallet();
	const { bridgeAction } = useBridge();
	const { connectedChain } = useWalletProvider();

	useEffect(() => {
		if (!api || !wallet || connectedChain !== "Ethereum") return;

		if (bridgeAction === "Deposit")
			fetchBridgeDepositStatus(api, wallet).then(setBridgeStatus);

		if (bridgeAction === "Withdraw")
			fetchBridgeWithdrawStatus(api, wallet).then(setBridgeStatus);
	}, [bridgeAction, api, wallet, connectedChain]);

	return bridgeStatus;
}
