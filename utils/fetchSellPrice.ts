import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import Big from "big.js";

// TODO: Add test
export default async function fetchSellPrice(
	api: Api,
	exchangeValue: string,
	exchangeAsset: CENNZAsset,
	receiveAsset: CENNZAsset
): Promise<number> {
	const amount = new Big(exchangeValue);
	const { price } = await (api.rpc as any).cennzx.sellPrice(
		exchangeAsset.assetId,
		amount.mul(exchangeAsset.decimalsValue).toFixed(0).toString(),
		receiveAsset.assetId
	);

	const sellPrice = new Big(price.toString()).div(receiveAsset.decimalsValue);

	return sellPrice.toNumber();
}
