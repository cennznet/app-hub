import { CENNZAsset, WalletOption } from "@/types";
import { Api } from "@cennznet/api";
import {
	Balance,
	getPegWithdrawExtrinsic,
	signAndSendTx,
	CENNZTransaction,
} from "@/utils";
import { Signer } from "@cennznet/api/types";
import signViaMetaMask from "./signViaMetaMask";

// TODO: Needs test
export default async function sendWithdrawCENNZRequest(
	api: Api,
	transferAmount: Balance,
	transferAsset: CENNZAsset,
	cennzAddress: string,
	ethereumAddress: string,
	signer: Signer,
	wallet: WalletOption
): Promise<CENNZTransaction> {
	const extrinsic = getPegWithdrawExtrinsic(
		api,
		transferAsset.assetId,
		transferAmount,
		ethereumAddress
	);

	let pegTx: CENNZTransaction;
	if (wallet === "CENNZnet")
		pegTx = await signAndSendTx(extrinsic, cennzAddress, signer);
	if (wallet === "MetaMask")
		pegTx = await signViaMetaMask(api, ethereumAddress, extrinsic);

	return pegTx;
}
