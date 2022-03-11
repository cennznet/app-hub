import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import Big from "big.js";

// TODO: Need test
export default function getBuyAssetExtrinsic(
	api: Api,
	exchangeAsset: CENNZAsset,
	exchangeAssetValue: number,
	receivedAsset: CENNZAsset,
	receivedAssetValue: number,
	slippagePercentage: number
): SubmittableExtrinsic<"promise"> {
	const exchangeAmount: Big = new Big(exchangeAssetValue).mul(
		exchangeAsset.decimalsValue
	);
	const receivedAmount: Big = new Big(receivedAssetValue).mul(
		receivedAsset.decimalsValue
	);
	const maxExchangeAmount: Big = exchangeAmount.mul(
		1 + slippagePercentage / 100
	);

	return api.tx.cennzx.buyAsset(
		null,
		exchangeAsset.assetId,
		receivedAsset.assetId,
		receivedAmount.toFixed(0).toString(),
		maxExchangeAmount.toFixed(0).toString()
	);
}
