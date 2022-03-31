import { fetchDepositRelayerStatus, waitUntil } from "@/utils";

type RelayerStatusReturn = Awaited<
	ReturnType<typeof fetchDepositRelayerStatus>
>;
type TimoutReturn = Awaited<ReturnType<typeof waitUntil>>;

// TODO: Needs test
export default async function ensureRelayerDepositDone(
	txHash: string,
	timeout: number = 60000
): Promise<RelayerStatusReturn> {
	const status = await waitUntilDepositDone(txHash, timeout);

	if (status === "timeout") throw { code: "RELAYER_TIMEOUT" };
	if (status === "Failed") throw { code: "RELAYER_STATUS_FAILED" };

	return status;
}

export async function waitUntilDepositDone(
	txHash: string,
	timeout: number = 60000
): Promise<RelayerStatusReturn | TimoutReturn> {
	let timedOut = false;

	const pollDepositRelayerStatus = () => {
		return new Promise<RelayerStatusReturn>((resolve, reject) => {
			const intervalId = setInterval(() => {
				fetchDepositRelayerStatus(txHash)
					.then((status) => {
						if (!timedOut && status === "Confirming") return;
						clearInterval(intervalId);
						resolve(status);
					})
					.catch((error) => {
						clearInterval(intervalId);
						reject(error);
					});
			}, 1000);
		});
	};

	return await Promise.race([
		waitUntil(timeout).then((response) => {
			timedOut = true;
			return response;
		}),
		pollDepositRelayerStatus(),
	]);
}
