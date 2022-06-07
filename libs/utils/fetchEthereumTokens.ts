import { EthereumToken } from "@/libs/types";
import EthereumTokens from "@/libs/artifacts/EthereumTokens.json";

export default function fetchEthereumTokens(chainId: number): EthereumToken[] {
	return EthereumTokens.tokens
		.filter((token) => token.chainId === chainId)
		.map((token) => ({
			address: token.address.toLowerCase(),
			symbol: token.symbol,
			decimals: token.decimals,
			decimalsValue: Math.pow(10, token.decimals),
		}));
}
