import { ETH_TOKEN_ADDRESS } from "@/libs/constants";
import { EthereumToken } from "@/libs/types";
import { Balance } from "@/libs/utils";
import { BigNumber, ethers } from "ethers";
import GenericERC20TokenAbi from "@/libs/artifacts/GenericERC20Token.json";

export default async function fetchEthereumBalance(
	provider: ethers.providers.Web3Provider,
	accountAddress: string,
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
