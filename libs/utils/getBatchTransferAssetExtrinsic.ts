import type {
	CENNZAssetBalances,
	CENNZnetExtrinsic,
	SubmittableExtrinsic,
} from "@/libs/types";

import { Api } from "@cennznet/api";

export default function getBatchTransferAssetExtrinsic(
	api: Api,
	transferAssets: CENNZAssetBalances,
	recipient: string
): CENNZnetExtrinsic | SubmittableExtrinsic<"promise"> {
	const transferTransactions = transferAssets.map((asset) =>
		api.tx.genericAsset.transfer(
			asset.assetId,
			recipient,
			asset.value.toFixed()
		)
	);
	return api.tx.utility.batch(transferTransactions);
}
