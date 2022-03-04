import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { CENNZAsset } from "@/types";
import { fetchExchangeRate } from "@/utils/swap";
import { useEffect, useState } from "react";

export default function useExchangeRate(
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

		fetchExchangeRate(api, exchangeToken, receivedToken).then(setExchangeRate);
	}, [api, exchangeTokenId, receivedTokenId, tokensList]);

	return exchangeRate;
}
