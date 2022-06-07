import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { useCallback, useEffect, useState } from "react";
import { fetchPoolUserInfo } from "@/libs/utils";
import { CENNZAsset, PoolUserInfo } from "@/libs/types";
import { useSelectedAccount } from "@/libs/hooks";

export interface PoolUserInfoHook {
	userInfo: PoolUserInfo;
	updatingPoolUserInfo: boolean;
	updatePoolUserInfo: () => Promise<void>;
}

export default function usePoolUserInfo(
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
): PoolUserInfoHook {
	const { api } = useCENNZApi();
	const [userInfo, setUserInfo] = useState<PoolUserInfo>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const selectedAccount = useSelectedAccount();

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
