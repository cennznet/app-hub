import { WithdrawClaim } from "@/types";
import { Api } from "@cennznet/api";
import { Contract, providers, utils as ethers } from "ethers";
import GenericERC20TokenAbi from "@/artifacts/GenericERC20Token.json";
import { ETH } from "@/utils/bridge";
import { ETH_CHAIN_ID } from "@/constants";

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
	let apiPrefix: string;

	switch (ETH_CHAIN_ID) {
		case 1:
			apiPrefix = "https://bridge-contracts.centralityapp.com";
			break;
		case 42:
			apiPrefix = "https://bridge-contracts.nikau.centrality.me";
			break;
	}

	const unclaimedRaw = await fetch(
		`${apiPrefix}/withdrawals/${selectedAccount}`
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error("No UNclaimed withdrawals found");
			} else return response.json();
		})
		.catch((err) => console.log(err.message));

	if (!unclaimedRaw) return;

	return await Promise.all<WithdrawClaim[]>(
		unclaimedRaw.withdrawals.map(async (withdrawal) => {
			if (withdrawal.hasClaimed) return;
			const tokenAddress = await api.query.erc20Peg.assetIdToErc20(
				withdrawal.assetId
			);
			const { tokenSymbol, amount } = await parseERC20Meta(
				tokenAddress.toString(),
				withdrawal.amount.trim()
			);
			const expiry = getExpiryString(withdrawal.expiresAt);

			return {
				tokenAddress: tokenAddress.toString(),
				tokenSymbol,
				amount,
				rawAmount: withdrawal.amount.trim(),
				expiry,
				eventProofId: withdrawal.proofId,
			};
		})
	);
}

const parseERC20Meta = async (tokenAddress: string, amount: string) => {
	if (tokenAddress === ETH)
		return { tokenSymbol: "ETH", amount: ethers.formatEther(amount) };

	const provider = new providers.Web3Provider(global.ethereum);
	const signer = provider.getSigner();

	const token: Contract = new Contract(
		tokenAddress,
		GenericERC20TokenAbi,
		signer
	);

	const decimals = await token.decimals();
	const symbol = await token.symbol();

	return { tokenSymbol: symbol, amount: ethers.formatUnits(amount, decimals) };
};

const getExpiryString = (expiresAt: number): String => {
	const expiry = expiresAt * 1000;
	const distance = expiry - Date.now();

	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor(
		(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

	return `Expires in: ${days}d ${hours}h ${minutes}m`;
};
