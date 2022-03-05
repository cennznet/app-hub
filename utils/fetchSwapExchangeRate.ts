import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import Big from "big.js";

// TODO: Add test
export default async function fetchSwapExchangeRate(
	api: Api,
	exchangeToken: CENNZAsset,
	receivedToken: CENNZAsset
): Promise<number> {
	const amount = new Big("1");
	const { price } = await (api.rpc as any).cennzx.sellPrice(
		exchangeToken.assetId,
		amount.mul(exchangeToken.decimalsValue).toString(),
		receivedToken.assetId
	);

	const sellPrice = new Big(price.toString());

	return sellPrice.div(receivedToken.decimalsValue).toNumber();
}
