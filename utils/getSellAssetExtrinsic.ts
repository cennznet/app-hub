import { Api } from "@cennznet/api";
import { Balance } from "@/utils";
import { CENNZAsset, CENNZnetExtrinsic, SubmittableExtrinsic } from "@/types";

export default function getSellAssetExtrinsic(
	api: Api,
	exchangeAssetId: CENNZAsset["assetId"],
	exchangeAssetValue: Balance,
	receiveAssetId: CENNZAsset["assetId"],
	receivedAssetValue: Balance,
	slippage: number
): CENNZnetExtrinsic | SubmittableExtrinsic<"promise"> {
	return api.tx.cennzx.sellAsset(
		null,
		exchangeAssetId,
		receiveAssetId,
		exchangeAssetValue.toFixed(0),
		receivedAssetValue.decrease(slippage).toFixed(0)
	);
}
