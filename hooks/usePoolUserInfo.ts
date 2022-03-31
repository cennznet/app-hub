import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useCallback, useEffect, useState } from "react";
import { fetchPoolUserInfo } from "@/utils";
import { CENNZAsset, PoolUserInfo } from "@/types";

export interface PoolUserInfoHook {
	userInfo: PoolUserInfo;
	updatingPoolUserInfo: boolean;
	updatePoolUserInfo: () => Promise<void>;
}

export default function usePoolUserInfo(
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
): PoolUserInfoHook {
	const { selectedAccount } = useCENNZWallet();
	const { api } = useCENNZApi();
	const [userInfo, setUserInfo] = useState<PoolUserInfo>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const updatePoolUserInfo = useCallback(async () => {
		if (!api) return;
		if (!selectedAccount?.address) return setLoading(false);
		setLoading(true);
		const userInfo = await fetchPoolUserInfo(
			api,
			selectedAccount.address,
			tradeAsset,
			coreAsset
		);

		setUserInfo(userInfo);
		setLoading(false);
	}, [api, selectedAccount?.address, tradeAsset, coreAsset]);

	useEffect(() => {
		updatePoolUserInfo();
	}, [updatePoolUserInfo]);

	return {
		userInfo,
		updatingPoolUserInfo: loading,
		updatePoolUserInfo,
	};
}
