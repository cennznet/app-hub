import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/libs/types";
import { Balance } from "@/libs/utils";

/**
 * Query `api.rpc.cennzx.sellPrice` to get a selling price from exchangeAsset -> receiveAsset
 *
 * @param {Api} api The api
 * @param {CENNZAsset} exchangeAssetId
 * @param {Balance} exchangeAssetValue
 * @param {CENNZAsset} receiveAsset
 * @return {Promise<Balance>}
 */
export default async function fetchSellPrice(
	api: Api,
	exchangeAssetId: CENNZAsset["assetId"],
	exchangeAssetValue: Balance,
	receiveAsset: CENNZAsset
): Promise<Balance> {
	const { price } = await api.rpc.cennzx.sellPrice(
		exchangeAssetId,
		exchangeAssetValue.toFixed(0, Balance.roundDown),
		receiveAsset.assetId
	);

	return Balance.fromBN(price, receiveAsset);
}
