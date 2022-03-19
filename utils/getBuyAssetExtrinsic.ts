import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { Balance } from "@/utils";

// TODO: Need test
export default function getBuyAssetExtrinsic(
	api: Api,
	exchangeAssetId: CENNZAsset["assetId"],
	exchangeAssetValue: Balance,
	receiveAssetId: CENNZAsset["assetId"],
	receivedAssetValue: Balance,
	slippage: number
): SubmittableExtrinsic<"promise"> {
	const maxExchangeAssetValue = exchangeAssetValue.increase(slippage);

	return api.tx.cennzx.buyAsset(
		null,
		exchangeAssetId,
		receiveAssetId,
		receivedAssetValue.toFixed(0),
		maxExchangeAssetValue.toFixed(0)
	);
}
