import { WithdrawClaim } from "@/types";
import { Api } from "@cennznet/api";
import { Contract, providers, utils as ethers } from "ethers";
import GenericERC20TokenAbi from "@/artifacts/GenericERC20Token.json";
import { ETH } from "@/utils/bridge";

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
		`https://bridge-contracts.nikau.centrality.me/withdrawals/${selectedAccount}`
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
			const tokenAddress = await api.query.erc20Peg.assetIdToErc20(
				withdrawal.assetId
			);
			const { token, amount } = await parseERC20Meta(
				tokenAddress.toString(),
				withdrawal.amount.trim()
			);
			const expiry = getExpiryString(withdrawal.expiresAt);

			const tx = await fetch(
				`https://bridge-contracts.nikau.centrality.me/transactions/${withdrawal.txHash}`
			)
				.then((response) => {
					if (!response.ok) {
						throw new Error("Error: Transaction not found");
					} else return response.json();
				})
				.catch((err) => console.log(err.message));

			// TODO: Get blockHash from tx
			console.log("tx", tx);

			return {
				token,
				amount,
				expiry,
				eventProofId: withdrawal.proofId,
				//blockHash
			};
		})
	);
}

const parseERC20Meta = async (tokenAddress: string, amount: string) => {
	if (tokenAddress === ETH)
		return { token: "ETH", amount: ethers.formatEther(amount) };

	const provider = new providers.Web3Provider(global.ethereum);
	const signer = provider.getSigner();

	const token: Contract = new Contract(
		tokenAddress,
		GenericERC20TokenAbi,
		signer
	);

	const decimals = await token.decimals();
	const symbol = await token.symbol();

	return { token: symbol, amount: ethers.formatUnits(amount, decimals) };
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
