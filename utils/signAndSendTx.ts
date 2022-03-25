import { Api } from "@cennznet/api";
import { Signer, SubmittableExtrinsic } from "@cennznet/api/types";

interface TxReceipt {
	hash: string;
	events: any[];
}

export default async function signAndSendTx(
	api: Api,
	extrinsic: SubmittableExtrinsic<"promise", any>,
	address: string,
	signer: Signer
): Promise<TxReceipt | "cancelled"> {
	const signAndSend = async () => {
		return new Promise<TxReceipt>((resolve, reject) => {
			extrinsic
				.signAndSend(address, { signer }, (progress) => {
					const { dispatchError, status, events } = progress;
					if (dispatchError && dispatchError?.isModule && status.isFinalized) {
						const { index, error } = dispatchError.asModule.toJSON();
						const errorMeta = api.registry.findMetaError(
							new Uint8Array([index, error])
						);
						const errorCode =
							errorMeta?.section && errorMeta?.name
								? `${errorMeta.section}.${errorMeta.name}`
								: `I${index}E${error}`;

						return reject(
							new Error(`${errorCode}:${status?.asFinalized?.toString()}`)
						);
					}
					if (status.isFinalized)
						return resolve({
							hash: status.asFinalized.toString(),
							events,
						} as TxReceipt);
				})
				.catch((error) => reject(error));
		});
	};

	try {
		return await signAndSend().then((receipt) => {
			console.info(`Transaction Finalized: ${receipt.hash}`);
			return receipt;
		});
	} catch (error) {
		if (error?.message === "Cancelled") return "cancelled";
		const err = new Error(
			"An error occured while sending your transaction request."
		);
		const infoPair = error?.message?.split?.(":");
		(err as any).code = infoPair?.[0].trim();
		console.info(`Transaction Failed: ${infoPair?.[1]}`);
		throw err;
	}
}
