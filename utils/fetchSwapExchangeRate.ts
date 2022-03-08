import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import Big from "big.js";

// TODO: Add test
export default async function fetchSwapExchangeRate(
	api: Api,
	exchangeValue: string,
	exchangeToken: CENNZAsset,
	receivedToken: CENNZAsset
): Promise<number> {
	const amount = new Big(exchangeValue);
	const { price } = await (api.rpc as any).cennzx.sellPrice(
		exchangeToken.assetId,
		amount.mul(exchangeToken.decimalsValue).toFixed(0).toString(),
		receivedToken.assetId
	);

	const sellPrice = new Big(price.toString()).div(receivedToken.decimalsValue);

	return sellPrice.div(amount).toNumber();
}
