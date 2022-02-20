import { ethers } from "ethers";
import GenericERC20TokenAbi from "@/artifacts/GenericERC20Token.json";
import { Chain } from "@/types";

export const ETH = "0x0000000000000000000000000000000000000000";
export const ETH_LOGO =
	"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png";

export const CHAINS: Chain[] = [
	{
		name: "CENNZnet",
		logo: "images/cennz.svg",
	},
	{
		name: "Ethereum",
		logo: ETH_LOGO,
	},
];

export const getMetamaskBalance = async (ethereum, tokenAddress, account) => {
	const provider = new ethers.providers.Web3Provider(ethereum);
	let balance, decimals;

	if (tokenAddress === ETH) {
		balance = await provider.getBalance(account);
	} else {
		const token: ethers.Contract = new ethers.Contract(
			tokenAddress,
			GenericERC20TokenAbi,
			provider
		);

		decimals = await token.decimals();

		balance = await token.balanceOf(account);
	}

	return Number(ethers.utils.formatUnits(balance, decimals));
};
