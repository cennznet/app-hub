import { BRIDGE_RELAYER_URL } from "@/libs/constants";
import { RelayerStatus } from "@/libs/types";

export default async function fetchDepositRelayerStatus(
	txHash: string
): Promise<RelayerStatus> {
	const relayerResponse = await fetch(
		`${BRIDGE_RELAYER_URL}/transactions/${txHash}`
	).then((response) => {
		if (response.status !== 200) throw { code: `RELAYER_${response.status}` };
		return response.json();
	});

	return relayerResponse.status;
}