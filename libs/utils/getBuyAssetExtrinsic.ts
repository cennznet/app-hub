import { CENNZAsset } from "@/libs/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { Balance } from "@/libs/utils";

export default function getBuyAssetExtrinsic(
	api: Api,
	exchangeAssetId: CENNZAsset["assetId"],
	exchangeAssetValue: Balance,
	receiveAssetId: CENNZAsset["assetId"],
	receivedAssetValue: Balance,
	slippage: number
): SubmittableExtrinsic<"promise"> {
	return api.tx.cennzx.buyAsset(
		null,
		exchangeAssetId,
		receiveAssetId,
		receivedAssetValue.toFixed(0),
		exchangeAssetValue.increase(slippage).toFixed(0)
	);
}
