import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchSellPrice } from "@/utils";
import { useSwap } from "@/providers/SwapProvider";
import debounce from "lodash/debounce";

export default function useSwapExchangeRate(
	exchangeValue: string = "1"
): [number, boolean, () => void] {
	const { api } = useCENNZApi();
	const [exchangeRate, setExchangeRate] = useState<number>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const { exchangeAsset, receiveAsset } = useSwap();

	const fetch = useMemo(() => {
		return debounce((api, exchangeValue, exchangeAsset, receiveAsset) => {
			const exValue = Number(exchangeValue);
			if (!exValue) return setExchangeRate(null);
			return fetchSellPrice(
				api,
				exchangeValue,
				exchangeAsset,
				receiveAsset
			).then(setExchangeRate);
		}, 150);
	}, []);

	const fetchExchangeRate = useCallback(async () => {
		if (!api) return;
		setLoading(true);
		await Promise.resolve(
			fetch(api, exchangeValue, exchangeAsset, receiveAsset)
		);
		setLoading(false);
	}, [api, fetch, exchangeValue, exchangeAsset, receiveAsset]);

	useEffect(() => {
		fetchExchangeRate();
	}, [fetchExchangeRate]);

	return [exchangeRate, loading, fetchExchangeRate];
}
