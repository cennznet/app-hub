import {
	CENNZAsset,
	CENNZnetExtrinsic,
	SubmittableExtrinsic,
} from "@/libs/types";
import { Balance } from "@utils";
import { Api } from "@cennznet/api";

export default function getPegWithdrawExtrinsic(
	api: Api,
	transferAssetId: CENNZAsset["assetId"],
	transferAssetValue: Balance,
	ethereumAddress: string
): CENNZnetExtrinsic | SubmittableExtrinsic<"promise"> {
	return api.tx.erc20Peg.withdraw(
		transferAssetId,
		transferAssetValue.toFixed(0),
		ethereumAddress
	);
}
