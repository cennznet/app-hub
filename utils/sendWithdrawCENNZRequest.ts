import {
	CENNZAsset,
	CENNZnetExtrinsic,
	SubmittableExtrinsic,
	WalletOption,
} from "@/types";
import { Api } from "@cennznet/api";
import {
	Balance,
	getPegWithdrawExtrinsic,
	signAndSendTx,
	CENNZTransaction,
	signViaEthWallet,
} from "@/utils";
import { Signer } from "@cennznet/api/types";
import { MetaMaskInpageProvider } from "@metamask/providers";

export default async function sendWithdrawCENNZRequest(
	api: Api,
	transferAmount: Balance,
	transferAsset: CENNZAsset,
	cennzAddress: string,
	ethereumAddress: string,
	signer: Signer,
	wallet: WalletOption,
	extension: MetaMaskInpageProvider
): Promise<CENNZTransaction> {
	const extrinsic = getPegWithdrawExtrinsic(
		api,
		transferAsset.assetId,
		transferAmount,
		ethereumAddress
	);

	let pegTx: CENNZTransaction;
	if (wallet === "CENNZnet")
		pegTx = await signAndSendTx(
			extrinsic as SubmittableExtrinsic<"promise">,
			cennzAddress,
			signer
		);
	if (wallet === "MetaMask")
		pegTx = await signViaEthWallet(
			api,
			ethereumAddress,
			extrinsic as CENNZnetExtrinsic,
			extension
		);

	return pegTx;
}
