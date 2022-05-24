import { fetchDepositRelayerStatus, waitUntil } from "@utils";
import { RelayerStatus, RelayerConfirmingStatus } from "@/libs/types";

type TimeoutReturn = Awaited<ReturnType<typeof waitUntil>>;

export default async function ensureRelayerDepositDone(
	txHash: string,
	timeout: number = 60000,
	confirmingCallback?: (status: RelayerConfirmingStatus) => void
): Promise<void> {
	const status = await waitUntilDepositDone(
		txHash,
		timeout,
		confirmingCallback
	);

	if (status === "timeout") throw { code: "RELAYER_TIMEOUT" };
	if (status === "Failed") throw { code: "RELAYER_STATUS_FAILED" };
}

export async function waitUntilDepositDone(
	txHash: string,
	timeout: number = 60000,
	confirmingCallback?: (status: RelayerConfirmingStatus) => void
): Promise<RelayerStatus | TimeoutReturn> {
	let timedOut = false;

	const pollDepositRelayerStatus = () => {
		return new Promise<RelayerStatus>((resolve, reject) => {
			const intervalId = setInterval(() => {
				fetchDepositRelayerStatus(txHash)
					.then((status) => {
						if (
							!timedOut &&
							(status === "EthereumConfirming" ||
								status === "CennznetConfirming")
						)
							return confirmingCallback?.(status);
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
