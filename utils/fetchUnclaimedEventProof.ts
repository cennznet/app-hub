import { BRIDGE_RELAYER_URL } from "@/constants";
import { HistoricalEventProof } from "@/types";

export default async function fetchUnclaimedEventProof(
	eventProofId: number
): Promise<HistoricalEventProof> {
	return await fetch(`${BRIDGE_RELAYER_URL}/proofs/${eventProofId}`)
		.then((response) => {
			if (!response.ok) throw new Error("No event proof found");

			return response.json();
		})
		.catch((err) => console.log(err.message));
}
