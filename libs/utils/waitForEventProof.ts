import { waitUntil } from "@/libs/utils";
import { Api } from "@cennznet/api";
import { EthEventProof } from "@cennznet/api/derives/ethBridge/types";
import { EthyEventId } from "@cennznet/types";

export default async function waitForEventProof(
	api: Api,
	eventProofId: EthyEventId
): Promise<EthEventProof> {
	const eventProof = await Promise.race([
		waitUntil(10000),
		new Promise<EthEventProof>(async (resolve) => {
			const unsubscribe = await api.rpc.chain.subscribeNewHeads(() => {
				api.derive.ethBridge.eventProof(eventProofId).then((eventProof) => {
					if (!eventProof) return;
					unsubscribe();
					resolve(eventProof);
				});
			});
		}),
	]);

	if (eventProof === "timeout") throw { code: "erc20Peg.EventProofTimeout" };

	return eventProof;
}
