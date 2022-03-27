import { ETH_TOKEN_ADDRESS } from "@/constants";
import { EthereumToken, MetaMaskAccount } from "@/types";
import { Balance } from "@/utils";
import { BigNumber, ethers } from "ethers";
import GenericERC20TokenAbi from "@/artifacts/GenericERC20Token.json";

// TODO: Needs test
export default async function fetchMetaMaskBalance(
	provider: ethers.providers.Web3Provider,
	accountAddress: MetaMaskAccount["address"],
	token: EthereumToken
): Promise<Balance> {
	if (token.address === ETH_TOKEN_ADDRESS) {
		const value: BigNumber = await provider.getBalance(accountAddress);
		return Balance.fromBigNumber(value, token);
	}

	const tokenContract = new ethers.Contract(
		token.address,
		GenericERC20TokenAbi,
		provider
	);

	const value: BigNumber = await tokenContract.balanceOf(accountAddress);
	return Balance.fromBigNumber(value, token);
}
