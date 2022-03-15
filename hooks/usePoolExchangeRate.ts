import { useState, useMemo, useCallback, useEffect } from "react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { usePool } from "@/providers/PoolProvider";
import debounce from "lodash/debounce";
import { fetchPoolExchangeInfo } from "@/utils";

export default function usePoolExchangeRate(): [number, boolean, () => void] {
	const { api } = useCENNZApi();
	const [exchangeRate, setExchangeRate] = useState<number>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const { tradeAsset, coreAsset } = usePool();

	const fetch = useMemo(() => {
		return debounce(async (api, tradeAsset, coreAsset) => {
			return fetchPoolExchangeInfo(api, tradeAsset, coreAsset).then(
				(exchangeInfo) => {
					setExchangeRate(
						exchangeInfo.tradeAssetBalance / exchangeInfo.coreAssetBalance
					);
				}
			);
		}, 150);
	}, []);

	const fetchExchangeRate = useCallback(async () => {
		if (!api) return;
		setLoading(true);
		await Promise.resolve(fetch(api, tradeAsset, coreAsset));
		setLoading(false);
	}, [api, fetch, tradeAsset, coreAsset]);

	useEffect(() => {
		fetchExchangeRate();
	}, [fetchExchangeRate]);

	return [exchangeRate, loading, fetchExchangeRate];
}
