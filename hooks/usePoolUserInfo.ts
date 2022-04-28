import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useCallback, useEffect, useState } from "react";
import { cvmToCENNZAddress, fetchPoolUserInfo } from "@/utils";
import { CENNZAsset, PoolUserInfo } from "@/types";
import { useMetaMaskWallet } from "@/providers/MetaMaskWalletProvider";
import { useWalletSelect } from "@/providers/WalletSelectProvider";

export interface PoolUserInfoHook {
	userInfo: PoolUserInfo;
	updatingPoolUserInfo: boolean;
	updatePoolUserInfo: () => Promise<void>;
}

export default function usePoolUserInfo(
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
): PoolUserInfoHook {
	const { selectedAccount: CENNZAccount } = useCENNZWallet();
	const { selectedAccount: metaMaskAccount } = useMetaMaskWallet();
	const { selectedWallet } = useWalletSelect();
	const { api } = useCENNZApi();
	const [userInfo, setUserInfo] = useState<PoolUserInfo>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const updatePoolUserInfo = useCallback(async () => {
		if (!api) return;
		if (
			(selectedWallet === "CENNZnet" && !CENNZAccount?.address) ||
			(selectedWallet === "MetaMask" && !metaMaskAccount?.address)
		)
			return setLoading(false);
		setLoading(true);
		const userInfo = await fetchPoolUserInfo(
			api,
			selectedWallet === "CENNZnet"
				? CENNZAccount.address
				: cvmToCENNZAddress(metaMaskAccount.address),
			tradeAsset,
			coreAsset
		);

		setUserInfo(userInfo);
		setLoading(false);
	}, [
		api,
		CENNZAccount?.address,
		tradeAsset,
		coreAsset,
		metaMaskAccount?.address,
		selectedWallet,
	]);

	useEffect(() => {
		if (!selectedWallet) return;

		void updatePoolUserInfo();
	}, [updatePoolUserInfo, selectedWallet]);

	return {
		userInfo,
		updatingPoolUserInfo: loading,
		updatePoolUserInfo,
	};
}
