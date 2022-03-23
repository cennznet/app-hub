import { WithdrawClaim } from "@/types";

/**
 * Fetch unclaimed withdraws for the selected account
 *
 * @param {string} selectedAccount Address of the selected account
 * @return {WithdrawClaim[]} Array of unclaimed withdraws
 */
export default async function fetchUnclaimedWithdrawals(
	selectedAccount: string
) {
	let unclaimed: WithdrawClaim[];

	return unclaimed;
}
