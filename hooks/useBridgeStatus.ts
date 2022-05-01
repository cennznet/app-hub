import { useBridge } from "@/providers/BridgeProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { BridgeStatus } from "@/types";
import { fetchBridgeDepositStatus, fetchBridgeWithdrawStatus } from "@/utils";
import { useEffect, useState } from "react";
import { useWalletSelect } from "@/providers/WalletSelectProvider";

export default function useBridgeStatus(): BridgeStatus {
	const [bridgeStatus, setBridgeStatus] = useState<BridgeStatus>("Active");
	const { api } = useCENNZApi();
	const { wallet } = useMetaMaskWallet();
	const { bridgeAction } = useBridge();
	const { connectedChain } = useWalletSelect();

	useEffect(() => {
		if (!api || !wallet || connectedChain !== "Ethereum") return;

		if (bridgeAction === "Deposit")
			fetchBridgeDepositStatus(api, wallet).then(setBridgeStatus);

		if (bridgeAction === "Withdraw")
			fetchBridgeWithdrawStatus(api, wallet).then(setBridgeStatus);
	}, [connectedChain, bridgeAction, api, wallet]);

	return bridgeStatus;
}
