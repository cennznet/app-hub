import { EthereumToken } from "@/types";
import EthereumTokens from "@/artifacts/EthereumTokens.json";

export default function fetchEthereumTokens(chainId: number): EthereumToken[] {
	return EthereumTokens.tokens
		.filter((token) => token.chainId === chainId)
		.map((token) => ({
			address: token.address,
			symbol: token.symbol,
			decimals: token.decimals,
		}));
}
