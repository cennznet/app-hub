import { BRIDGE_RELAYER_URL } from "@/constants";

type RelayerStatus = "Successful" | "Failed" | "Confirming";

// TODO: Needs test
export default async function fetchDepositRelayerStatus(
	txHash: string
): Promise<RelayerStatus> {
	const response = await fetch(
		`${BRIDGE_RELAYER_URL}/transactions/${txHash}`
	).then((response) => {
		if (response.status !== 200) throw { code: `RELAYER_${response.status}` };
		return response.json();
	});

	if (response.status === "Successful" || response.status === "Failed")
		return response.status;

	return "Confirming";
}
