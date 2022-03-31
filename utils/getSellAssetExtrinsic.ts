import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { Balance } from "@/utils";

// TODO: Need test
export default function getSellAssetExtrinsic(
	api: Api,
	exchangeAssetId: CENNZAsset["assetId"],
	exchangeAssetValue: Balance,
	receiveAssetId: CENNZAsset["assetId"],
	receivedAssetValue: Balance,
	slippage: number
): SubmittableExtrinsic<"promise"> {
	return api.tx.cennzx.sellAsset(
		null,
		exchangeAssetId,
		receiveAssetId,
		exchangeAssetValue.toFixed(0),
		receivedAssetValue.decrease(slippage).toFixed(0)
	);
}
