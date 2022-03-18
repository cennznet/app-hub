import { useState, useMemo, useCallback, useEffect } from "react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import debounce from "lodash/debounce";
import { fetchPoolExchangeInfo } from "@/utils";
import { CENNZAsset, PoolExchangeInfo } from "@/types";

export interface PoolExchangeRateHook {
	exchangeRate: number;
	exchangeInfo: PoolExchangeInfo;
	updatingExchangeRate: boolean;
	updateExchangeRate: () => void;
}

export default function usePoolExchangeRate(
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
): PoolExchangeRateHook {
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
			setExchangeInfo(exchangeInfo);
			setExchangeRate(
				exchangeInfo.tradeAssetReserve / exchangeInfo.coreAssetReserve
			);
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
