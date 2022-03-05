import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { CENNZAsset } from "@/types";
import { useEffect, useState } from "react";
import { fetchSwapExchangeRate } from "@/utils";

export default function useSwapExchangeRate(
	exchangeTokenId: CENNZAsset["assetId"],
	receivedTokenId: CENNZAsset["assetId"],
	tokensList: CENNZAsset[]
): number {
	const { api } = useCENNZApi();
	const [exchangeRate, setExchangeRate] = useState<number>(null);

	useEffect(() => {
		if (!api || !tokensList?.length) return;

		if (exchangeTokenId === receivedTokenId) return setExchangeRate(1);

		const exchangeToken = tokensList.find(
			(balance) => balance.assetId === exchangeTokenId
		);
		const receivedToken = tokensList.find(
			(balance) => balance.assetId === receivedTokenId
		);

		fetchSwapExchangeRate(api, exchangeToken, receivedToken).then(
			setExchangeRate
		);
	}, [api, exchangeTokenId, receivedTokenId, tokensList]);

	return exchangeRate;
}
