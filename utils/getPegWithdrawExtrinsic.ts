import { CENNZAsset } from "@/types";
import { Balance } from "@/utils";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";

// TODO: Need test
export default function getPegWithdrawExtrinsic(
	api: Api,
	transferAssetId: CENNZAsset["assetId"],
	transferAssetValue: Balance,
	ethereumAddress: string
): SubmittableExtrinsic<"promise"> {
	return api.tx.erc20Peg.withdraw(
		transferAssetId,
		transferAssetValue.toFixed(0),
		ethereumAddress
	);
}
