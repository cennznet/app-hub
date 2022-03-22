import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { Balance } from "@/utils";

/**
 * Query `api.derive.fees.estimateFee` for a given extrinsic
 * to provide gas fee estimate
 *
 * @param {Api} api
 * @param {SubmittableExtrinsic<"promise">} extrinsic
 * @param {CENNZAsset} userFeeAsset
 * @return {Promise<Balance>}
 */
export default async function fetchGasFee(
	api: Api,
	extrinsic: SubmittableExtrinsic<"promise">,
	userFeeAsset: CENNZAsset
): Promise<Balance> {
	const response = await api.derive.fees.estimateFee({
		extrinsic,
		userFeeAssetId: userFeeAsset.assetId,
	});

	if (response instanceof Error) return Balance.fromInput("0", null);
	return Balance.fromApiBalance(response, userFeeAsset);
}
