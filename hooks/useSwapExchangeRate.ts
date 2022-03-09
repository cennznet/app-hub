import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useEffect, useState } from "react";
import { fetchSellPrice } from "@/utils";
import { useSwap } from "@/providers/SwapProvider";

export default function useSwapExchangeRate(): number {
	const { api } = useCENNZApi();
	const [exchangeRate, setExchangeRate] = useState<number>(null);
	const { exchangeToken, receiveToken, exchangeTokens } = useSwap();

	const exchangeTokenId = exchangeToken.tokenId;
	const receiveTokenId = receiveToken.tokenId;

	useEffect(() => {
		if (!api || !exchangeTokens?.length || exchangeTokenId === receiveTokenId)
			return;

		const exchangeToken = exchangeTokens.find(
			(token) => token.assetId === exchangeTokenId
		);
		const receivedToken = exchangeTokens.find(
			(token) => token.assetId === receiveTokenId
		);

		fetchSellPrice(api, "1", exchangeToken, receivedToken).then(
			setExchangeRate
		);
	}, [api, exchangeTokenId, receiveTokenId, exchangeTokens]);

	return exchangeRate;
}
