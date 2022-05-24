import { useBridge } from "@providers/BridgeProvider";
import { useMetaMaskWallet } from "@providers/MetaMaskWalletProvider";
import { Balance, getBridgeContract } from "@utils";
import { useCallback, useEffect, useState } from "react";
import { useWalletProvider } from "@providers/WalletProvider";

interface BridgeVerificationFeeHook {
	verificationFee: Balance;
	updatingVerificationFee: boolean;
	updateVerificationFee: () => void;
}

export default function useBridgeVerificationFee(): BridgeVerificationFeeHook {
	const { wallet } = useMetaMaskWallet();
	const [loading, setLoading] = useState<boolean>(true);
	const [verificationFee, setVerificationFee] = useState<Balance>(null);
	const { ethAsset } = useBridge();
	const { connectedChain } = useWalletProvider();

	const updateVerificationFee = useCallback(async () => {
		if (!wallet || connectedChain !== "Ethereum") return;
		setLoading(true);
		const bridgeContract = getBridgeContract<"OnBehalf">(wallet.getSigner());

		const verificationFee = await bridgeContract.verificationFee();
		setVerificationFee(Balance.fromBigNumber(verificationFee, ethAsset));
		setLoading(false);
	}, [wallet, ethAsset, connectedChain]);

	useEffect(() => {
		void updateVerificationFee?.();
	}, [updateVerificationFee]);

	return {
		verificationFee,
		updatingVerificationFee: loading,
		updateVerificationFee,
	};
}
