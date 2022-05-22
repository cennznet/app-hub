import { Api } from "@cennznet/api";
import { Balance } from "@/utils";
import { CENNZAsset, CENNZnetExtrinsic, SubmittableExtrinsic } from "@/types";

export default function getBatchTransferAssetExtrinsic(
	api: Api,
	assetIds: CENNZAsset["assetId"][],
	balances: Balance[],
	recipient: string
): CENNZnetExtrinsic | SubmittableExtrinsic<"promise"> {
	//ensure assetId and balance array length match
	if (balances.length !== assetIds.length)
		throw new Error(
			"The provided balances and assetId length doesn't match for batch transfer."
		);
	const transferTransactions = assetIds.map((assetId, index) => {
		return api.tx.genericAsset.transfer(
			assetId,
			recipient,
			balances[index].toFixed(0)
		);
	});
	return api.tx.utility.batch(transferTransactions);
}
