import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import Big from "big.js";

// TODO: Need test
export default async function fetchGasFee(
	api: Api,
	extrinsic: SubmittableExtrinsic<"promise">,
	userFeeAsset: CENNZAsset
): Promise<number> {
	const response = await api.derive.fees.estimateFee({
		extrinsic,
		userFeeAssetId: userFeeAsset.assetId,
	});

	if (response instanceof Error) return 0;

	const fee = new Big(response.toString());
	return fee.div(userFeeAsset.decimalsValue).toNumber();
}
