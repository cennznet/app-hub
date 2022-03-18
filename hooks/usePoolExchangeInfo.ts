import { useState, useMemo, useCallback, useEffect } from "react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import debounce from "lodash/debounce";
import { fetchPoolExchangeInfo } from "@/utils";
import { CENNZAsset, PoolExchangeInfo } from "@/types";

export interface PoolExchangeInfoHook {
	exchangeRate: number;
	exchangeInfo: PoolExchangeInfo;
	updatingExchangeRate: boolean;
	updateExchangeRate: () => void;
}

export default function usePoolExchangeInfo(
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
): PoolExchangeInfoHook {
	const { api } = useCENNZApi();
	const [exchangeRate, setExchangeRate] = useState<number>(null);
	const [exchangeInfo, setExchangeInfo] = useState<PoolExchangeInfo>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const fetch = useMemo(() => {
		return debounce(async (api, tradeAsset, coreAsset) => {
			const exchangeInfo = await fetchPoolExchangeInfo(
				api,
				tradeAsset,
				coreAsset
			);
			const { tradeAssetReserve, coreAssetReserve } = exchangeInfo;

			setExchangeInfo(exchangeInfo);
			setExchangeRate(tradeAssetReserve.div(coreAssetReserve).toNumber());
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
		exchangeRate,
		exchangeInfo,
		updatingExchangeRate: loading,
		updateExchangeRate,
	};
}
