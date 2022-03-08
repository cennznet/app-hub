import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { CENNZAsset } from "@/types";
import { useEffect, useState } from "react";
import { fetchSwapExchangeRate } from "@/utils";

export default function useSwapExchangeRate(
	exchangeValue: string,
	exchangeTokenId: CENNZAsset["assetId"],
	receivedTokenId: CENNZAsset["assetId"],
	tokensList: CENNZAsset[]
): number {
	const { api } = useCENNZApi();
	const [exchangeRate, setExchangeRate] = useState<number>(null);

	useEffect(() => {
		if (!api || !tokensList?.length || exchangeTokenId === receivedTokenId)
			return;

		const exValue = Number(exchangeValue);

		const exchangeToken = tokensList.find(
			(token) => token.assetId === exchangeTokenId
		);
		const receivedToken = tokensList.find(
			(token) => token.assetId === receivedTokenId
		);

		fetchSwapExchangeRate(
			api,
			exValue && !isNaN(exValue) ? exchangeValue : "1",
			exchangeToken,
			receivedToken
		).then(setExchangeRate);
	}, [api, exchangeValue, exchangeTokenId, receivedTokenId, tokensList]);

	return exchangeRate;
}
