import { CENNZ_NETWORK } from "@/libs/constants";
import { RelayerStatus } from "@/libs/types";

export default async function fetchDepositRelayerStatus(
	txHash: string
): Promise<RelayerStatus> {
	const relayerResponse = await fetch(
		`${CENNZ_NETWORK.ClaimRelayerUrl}/transactions/${txHash}`
	).then((response) => {
		if (response.status !== 200) throw { code: `RELAYER_${response.status}` };
		return response.json();
	});

	return relayerResponse.status;
}
