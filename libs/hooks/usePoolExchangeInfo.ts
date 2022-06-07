import { useState, useMemo, useCallback, useEffect } from "react";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import debounce from "lodash/debounce";
import { fetchPoolExchangeInfo } from "@/libs/utils";
import { CENNZAsset, PoolExchangeInfo } from "@/libs/types";

export interface PoolExchangeInfoHook {
	exchangeInfo: PoolExchangeInfo;
	updatingExchangeInfo: boolean;
	updateExchangeRate: () => void;
}

export default function usePoolExchangeInfo(
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
): PoolExchangeInfoHook {
	const { api } = useCENNZApi();
	const [exchangeInfo, setExchangeInfo] = useState<PoolExchangeInfo>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const fetch = useMemo(() => {
		return debounce(async (api, tradeAsset, coreAsset) => {
			const exchangeInfo = await fetchPoolExchangeInfo(
				api,
				tradeAsset,
				coreAsset
			);

			setExchangeInfo(exchangeInfo);
			setLoading(false);
		}, 150);
	}, []);

	const updateExchangeRate = useCallback(() => {
		if (!api) return;
		setLoading(true);
		fetch(api, tradeAsset, coreAsset);
	}, [api, fetch, tradeAsset, coreAsset]);

	useEffect(() => {
		updateExchangeRate();
	}, [updateExchangeRate]);

	return {
		exchangeInfo,
		updatingExchangeInfo: loading,
		updateExchangeRate,
	};
}
