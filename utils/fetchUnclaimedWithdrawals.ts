import { Api } from "@cennznet/api";
import { BridgedEthereumToken, WithdrawClaim } from "@/types";
import { BRIDGE_RELAYER_URL } from "@/constants";
import {
	Balance,
	fetchBridgeTokens,
	fetchUnclaimedEventProof,
	getDaysHoursMinutes,
} from "@/utils";

/**
 * Fetch unclaimed withdraws for the selected account
 *
 * @param {string} selectedAccount Address of the selected account
 * @param {Api} api CENNZnet API
 * @return {Promise<WithdrawClaim[]>} Array of unclaimed withdraws
 */
export default async function fetchUnclaimedWithdrawals(
	selectedAccount: string,
	api: Api
): Promise<WithdrawClaim[]> {
	const unclaimedRaw = await fetch(
		`${BRIDGE_RELAYER_URL}/withdrawals/${selectedAccount}`
	)
		.then((response) => {
			if (!response.ok) throw new Error("No UNclaimed withdrawals found");

			return response.json();
		})
		.catch((err) => console.log(err.message));

	if (!unclaimedRaw) return;

	return await Promise.all<WithdrawClaim[]>(
		unclaimedRaw.withdrawals.map(async (withdrawal) => {
			if (!!withdrawal.hasClaimed) return;

			const bridgeTokens = await fetchBridgeTokens(api, "Withdraw");
			const transferAsset = bridgeTokens.find(
				(token: BridgedEthereumToken) =>
					token.assetId === Number(withdrawal.assetId)
			);
			const transferAmount = new Balance(
				withdrawal.amount.trim(),
				transferAsset
			);
			const eventProof = await fetchUnclaimedEventProof(
				Number(withdrawal.proofId)
			);

			return {
				assetId: Number(withdrawal.assetId),
				expiry: getDaysHoursMinutes(withdrawal.expiresAt),
				expiryRaw: withdrawal.expiresAt,
				eventProofId: Number(withdrawal.proofId),
				transferAsset: transferAsset as BridgedEthereumToken,
				transferAmount,
				beneficiary: withdrawal.beneficiary,
				eventProof,
			};
		})
	);
}
