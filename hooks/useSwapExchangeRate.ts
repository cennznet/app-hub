import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchSellPrice } from "@/utils";
import { useSwap } from "@/providers/SwapProvider";
import debounce from "lodash/debounce";

export default function useSwapExchangeRate(
	exchangeValue: string = "1"
): [number, () => void] {
	const { api } = useCENNZApi();
	const [exchangeRate, setExchangeRate] = useState<number>(null);
	const { exchangeAsset, receiveAsset } = useSwap();

	const fetch = useMemo(() => {
		return debounce((api, exchangeValue, exchangeAsset, receiveAsset) => {
			const exValue = Number(exchangeValue);
			if (!exValue) return setExchangeRate(null);
			fetchSellPrice(api, exchangeValue, exchangeAsset, receiveAsset).then(
				setExchangeRate
			);
		}, 150);
	}, []);

	const fetchExchangeRate = useCallback(() => {
		fetch(api, exchangeValue, exchangeAsset, receiveAsset);
	}, [api, fetch, exchangeValue, exchangeAsset, receiveAsset]);

	useEffect(() => {
		if (!api) return;
		fetch(api, exchangeValue, exchangeAsset, receiveAsset);
	}, [api, fetch, exchangeValue, exchangeAsset, receiveAsset]);

	return [exchangeRate, fetchExchangeRate];
}
