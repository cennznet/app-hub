import { EthereumToken } from "@/types";
import fetchEthereumTokens from "@/utils/fetchEthereumTokens";

export default async function fetchBridgeTokens(): Promise<EthereumToken[]> {
	return Promise.resolve(
		fetchEthereumTokens(parseInt(process.env.NEXT_PUBLIC_ETH_CHAIN_ID, 10))
	);
}
