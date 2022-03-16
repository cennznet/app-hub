import { useState, useMemo, useCallback, useEffect } from "react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import debounce from "lodash/debounce";
import { fetchPoolExchangeInfo, PoolExchangeInfo } from "@/utils";
import { CENNZAsset } from "@/types";

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
		return debounce((api, tradeAsset, coreAsset) => {
			return fetchPoolExchangeInfo(api, tradeAsset, coreAsset).then(
				(exchangeInfo) => {
					setExchangeInfo(exchangeInfo);
					setExchangeRate(
						exchangeInfo.tradeAssetBalance / exchangeInfo.coreAssetBalance
					);
					setLoading(false);
				}
			);
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
