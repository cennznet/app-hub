import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchSellPrice } from "@/utils";
import { useSwap } from "@/providers/SwapProvider";
import debounce from "lodash/debounce";

export default function useSwapExchangeRate(exchangeValue: string): {
	exchangeRate: number;
	updatingExchangeRate: boolean;
	updateExchangeRate: () => void;
} {
	const { api } = useCENNZApi();
	const [exchangeRate, setExchangeRate] = useState<number>(null);
	const [loading, setLoading] = useState<boolean>(true);
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
			).then((exchangeRate) => {
				setExchangeRate(exchangeRate);
				setLoading(false);
			});
		}, 150);
	}, []);

	const updateExchangeRate = useCallback(() => {
		if (!api) return;
		setLoading(true);
		fetch(api, exchangeValue, exchangeAsset, receiveAsset);
	}, [api, fetch, exchangeValue, exchangeAsset, receiveAsset]);

	useEffect(() => {
		updateExchangeRate();
	}, [updateExchangeRate]);

	return { exchangeRate, updatingExchangeRate: loading, updateExchangeRate };
}
