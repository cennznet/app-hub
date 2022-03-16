import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import Big from "big.js";

/**
 * Query `api.rpc.cennzx.sellPrice` to get a selling price
 * from exchangeAsset -> receiveAsset
 *
 * @param {Api} api
 * @param {string} exchangeValue
 * @param {CENNZAsset} exchangeAsset
 * @param {CENNZAsset} receiveAsset
 * @return {Promise<number>}
 */
export default async function fetchSellPrice(
	api: Api,
	exchangeValue: string,
	exchangeAsset: CENNZAsset,
	receiveAsset: CENNZAsset
): Promise<number> {
	const amount = new Big(exchangeValue);
	const { price } = await (api.rpc as any).cennzx.sellPrice(
		exchangeAsset.assetId,
		amount.mul(exchangeAsset.decimalsValue).toFixed(0),
		receiveAsset.assetId
	);

	const sellPrice = new Big(price.toString()).div(receiveAsset.decimalsValue);

	return sellPrice.toNumber();
}
