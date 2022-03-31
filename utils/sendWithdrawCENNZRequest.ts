import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import { Balance, getPegWithdrawExtrinsic, waitUntil } from "@/utils";
import signAndSendTx from "@/utils/signAndSendTx";
import { Signer } from "@cennznet/api/types";
import { EthEventProof } from "@cennznet/api/derives/ethBridge/types";

// TODO: Needs test
export default async function sendWithdrawCENNZRequest(
	api: Api,
	transferAmount: Balance,
	transferAsset: CENNZAsset,
	cennzAddress: string,
	ethereumAddress: string,
	signer: Signer
): Promise<EthEventProof | "cancelled"> {
	const extrinsic = getPegWithdrawExtrinsic(
		api,
		transferAsset.assetId,
		transferAmount,
		ethereumAddress
	);

	const status = await signAndSendTx(api, extrinsic, cennzAddress, signer);

	if (status === "cancelled") return status;

	const erc20WithdrawEvent = status.events?.find((event) => {
		const {
			event: { method, section },
		} = event;

		return section === "erc20Peg" && method === "Erc20Withdraw";
	});

	const eventProofId = erc20WithdrawEvent?.event?.data?.[0];

	if (!eventProofId) throw { code: "erc20Peg.EventProofIdNotFound" };

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
