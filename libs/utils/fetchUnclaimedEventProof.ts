import { CENNZ_NETWORK } from "@/libs/constants";
import { HistoricalEventProof } from "@/libs/types";

export default async function fetchUnclaimedEventProof(
	eventProofId: number
): Promise<HistoricalEventProof> {
	return await fetch(`${CENNZ_NETWORK.ClaimRelayerUrl}/proofs/${eventProofId}`)
		.then((response) => {
			if (!response.ok) throw { message: "No event proof found" };

			return response.json();
		})
		.catch((error) => console.log(error.message));
}
