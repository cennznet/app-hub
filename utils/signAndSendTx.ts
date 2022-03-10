import { Signer, SubmittableExtrinsic } from "@cennznet/api/types";

export default async function signAndSendTx(
	extrinsic: SubmittableExtrinsic<"promise", any>,
	address: string,
	signer: Signer
): Promise<string | "cancelled"> {
	const signAndSend = async () => {
		return new Promise((resolve, reject) => {
			extrinsic
				.signAndSend(address, { signer }, (progress) => {
					const { dispatchError, status } = progress;
					if (dispatchError && dispatchError?.isModule && status.isFinalized) {
						const { index, error } = dispatchError.asModule.toJSON();
						return reject(
							new Error(`I${index}E${error}:${status?.asFinalized?.toString()}`)
						);
					}
					if (status.isFinalized) return resolve(status.asFinalized.toString());
				})
				.catch((error) => reject(error));
		});
	};

	try {
		return await signAndSend().then((status) => {
			console.info(`Transaction Finalized: ${status}`);
			return status as string;
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
