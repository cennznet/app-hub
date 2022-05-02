import { CENNZTransaction } from "@/utils";
import { SubmittableResult } from "@cennznet/api";
import { Signer, SubmittableExtrinsic } from "@cennznet/api/types";

export default async function signAndSendTx(
	extrinsic: SubmittableExtrinsic<"promise", any>,
	address: string,
	signer: Signer
): Promise<CENNZTransaction> {
	const tx = new CENNZTransaction();

	extrinsic
		.signAndSend(address, { signer }, (result: SubmittableResult) => {
			const { txHash } = result;
			console.info("Transaction", txHash.toString());
			tx.setHash(txHash.toString());
			tx.setResult(result);
		})
		.catch((error) => {
			if (error?.message !== "Cancelled") throw error;
			tx.setCancel();
		});

	return tx;
}
