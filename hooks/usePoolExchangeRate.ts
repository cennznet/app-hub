import { useState, useMemo, useCallback, useEffect } from "react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { usePool } from "@/providers/PoolProvider";
import debounce from "lodash/debounce";
import { fetchPoolExchangeInfo } from "@/utils";

export default function usePoolExchangeRate(): [number, boolean, () => void] {
	const { api } = useCENNZApi();
	const [exchangeRate, setExchangeRate] = useState<number>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const { tradeAsset } = usePool();

	const fetch = useMemo(() => {
		return debounce(async (api, tradeAssetId) => {
			return fetchPoolExchangeInfo(api, tradeAssetId).then((exchangeInfo) => {
				setExchangeRate(
					exchangeInfo.tradeAssetBalance / exchangeInfo.coreAssetBalance
				);
			});
		}, 150);
	}, []);

	const fetchExchangeRate = useCallback(async () => {
		if (!api) return;
		setLoading(true);
		const tradeAssetId = tradeAsset.assetId;
		await Promise.resolve(fetch(api, tradeAssetId));
		setLoading(false);
	}, [api, fetch, tradeAsset.assetId]);

	useEffect(() => {
		fetchExchangeRate();
	}, [fetchExchangeRate]);

	return [exchangeRate, loading, fetchExchangeRate];
}
