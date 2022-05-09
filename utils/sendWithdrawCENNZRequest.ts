import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import {
	Balance,
	getPegWithdrawExtrinsic,
	signAndSendTx,
	CENNZTransaction,
} from "@/utils";
import { Signer } from "@cennznet/api/types";

export default async function sendWithdrawCENNZRequest(
	api: Api,
	transferAmount: Balance,
	transferAsset: CENNZAsset,
	cennzAddress: string,
	ethereumAddress: string,
	signer: Signer
): Promise<CENNZTransaction> {
	const extrinsic = getPegWithdrawExtrinsic(
		api,
		transferAsset.assetId,
		transferAmount,
		ethereumAddress
	);
	const pegTx = await signAndSendTx(extrinsic, cennzAddress, signer);

	return pegTx;
}
