import { useBridge } from "@/providers/BridgeProvider";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { Balance } from "@/utils";
import { useCallback, useEffect, useState } from "react";

interface BridgeGasFeeHook {
	gasFee: Balance;
	updatingGasFee: boolean;
	updateGasFee: () => void;
}

export default function useBridgeGasFee(): BridgeGasFeeHook {
	const { wallet } = useMetaMaskWallet();
	const [loading, setLoading] = useState<boolean>(true);
	const [gasFee, setGasFee] = useState<Balance>(null);
	const { ethAsset } = useBridge();

	const updateGasFee = useCallback(async () => {
		if (!wallet) return;
		setLoading(true);
		const gasPrice = await wallet.getSigner().getGasPrice();
		setGasFee(Balance.fromBigNumber(gasPrice, ethAsset).mul(150000));
		setLoading(false);
	}, [wallet, ethAsset]);

	useEffect(() => {
		updateGasFee?.();
	}, [updateGasFee]);

	return { gasFee, updatingGasFee: loading, updateGasFee };
}
