import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Balance, fetchSellPrice } from "@/libs/utils";
import { useSwap } from "@/libs/providers/SwapProvider";
import debounce from "lodash/debounce";
import { CENNZAsset } from "@/libs/types";
import { Api } from "@cennznet/api";

interface SwapExchangeRateHook {
	exchangeRate: Balance;
	updatingExchangeRate: boolean;
	updateExchangeRate: () => void;
}

export default function useSwapExchangeRate(
	exchangeValue: string
): SwapExchangeRateHook {
	const { api } = useCENNZApi();
	const [exchangeRate, setExchangeRate] = useState<Balance>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { exchangeAsset, receiveAsset } = useSwap();

	const fetch = useMemo(() => {
		return debounce(
			(
				api: Api,
				exchangeValue: string,
				exchangeAsset: CENNZAsset,
				receiveAsset: CENNZAsset
			) => {
				const exValue = Number(exchangeValue);
				if (!exValue) return setExchangeRate(null);
				return fetchSellPrice(
					api,
					exchangeAsset.assetId,
					Balance.fromInput(exchangeValue, exchangeAsset),
					receiveAsset
				).then((exchangeRate) => {
					setExchangeRate(exchangeRate);
					setLoading(false);
				});
			},
			150
		);
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
