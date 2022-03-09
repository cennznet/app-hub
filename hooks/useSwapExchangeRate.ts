import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useEffect, useState, useMemo } from "react";
import { fetchSellPrice } from "@/utils";
import { useSwap } from "@/providers/SwapProvider";
import throttle from "lodash/throttle";

export default function useSwapExchangeRate(
	exchangeValue: string = "1"
): number {
	const { api } = useCENNZApi();
	const [exchangeRate, setExchangeRate] = useState<number>(null);
	const { exchangeAsset, receiveAsset } = useSwap();

	const fetch = useMemo(() => {
		const exValue = Number(exchangeValue);

		if (!api || !exValue) return setExchangeRate(null);

		return throttle(() => {
			fetchSellPrice(api, exchangeValue, exchangeAsset, receiveAsset).then(
				setExchangeRate
			);
		}, 100);
	}, [api, exchangeValue, exchangeAsset, receiveAsset]);

	useEffect(() => {
		if (!fetch) return;
		fetch();
	}, [fetch]);

	return exchangeRate;
}
