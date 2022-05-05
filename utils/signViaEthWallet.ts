import { Api, SubmittableResult } from "@cennznet/api";
import { CENNZTransaction } from "@/utils";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { CENNZnetExtrinsic } from "@/types";

export default async function signViaEthWallet(
	api: Api,
	ethAddress: string,
	extrinsic: CENNZnetExtrinsic,
	extension: MetaMaskInpageProvider
): Promise<CENNZTransaction> {
	const tx = new CENNZTransaction();

	extrinsic
		.signViaEthWallet(
			ethAddress,
			api,
			extension,
			(result: SubmittableResult) => {
				const { txHash } = result;
				console.info("Transaction", txHash.toString());
				tx.setHash(txHash.toString());
				tx.setResult(result);
			}
		)
		.catch((error) => {
			if (error?.code !== 4001) throw error;
			tx.setCancel();
		});

	return tx;
}
