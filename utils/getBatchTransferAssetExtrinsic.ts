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
		const transferValue =
			parseFloat(asset.value.toBalance()) * 10 ** asset.decimals;
		return api.tx.genericAsset.transfer(
			asset.assetId,
			recipient,
			transferValue.toString()
		);
	});
	return api.tx.utility.batch(transferTransactions);
}
