import { Api } from "@cennznet/api";
import { CENNZTransaction, cvmToCENNZAddress } from "@/utils";
import { SubmittableExtrinsic } from "@cennznet/api/types";

export default async function signViaMetaMask(
	api: Api,
	ethAddress: string,
	extrinsic: SubmittableExtrinsic<"promise", any>
): Promise<CENNZTransaction> {
	const tx = new CENNZTransaction();

	const cennzAddress = cvmToCENNZAddress(ethAddress);
	const nonce = await api.rpc.system.accountNextIndex(cennzAddress);
	const payload = api
		.createType("ethWalletCall", { call: extrinsic, nonce })
		.toHex();

	const signature = await global.ethereum.request({
		method: "personal_sign",
		params: [payload, ethAddress],
	});

	api.tx.ethWallet
		.call(extrinsic, ethAddress, signature)
		.send((result) => {
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
