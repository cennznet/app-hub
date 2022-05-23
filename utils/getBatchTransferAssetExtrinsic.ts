import { Api } from "@cennznet/api";
import {
	CENNZAssetBalance,
	CENNZnetExtrinsic,
	SubmittableExtrinsic,
} from "@/types";

export default function getBatchTransferAssetExtrinsic(
	api: Api,
	transferAssets: CENNZAssetBalance[],
	recipient: string
): CENNZnetExtrinsic | SubmittableExtrinsic<"promise"> {
	const transferTransactions = transferAssets.map((asset) => {
		return api.tx.genericAsset.transfer(
			asset.assetId,
			recipient,
			asset.value.toFixed(0)
		);
	});
	return api.tx.utility.batch(transferTransactions);
}
