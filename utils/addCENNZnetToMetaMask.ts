import { CENNZ_METAMASK_NETWORK } from "@/constants";

export default async function addCENNZnetToMetaMask() {
	await global.ethereum.request({
		method: "wallet_addEthereumChain",
		params: [
			{
				chainId: CENNZ_METAMASK_NETWORK.chainId,
				blockExplorerUrls: ["https://uncoverexplorer.com"],
				chainName: CENNZ_METAMASK_NETWORK.chainName,
				nativeCurrency: {
					name: "CPAY",
					symbol: "CPAY",
					decimals: 18,
				},
				rpcUrls: [CENNZ_METAMASK_NETWORK.rpcUrl],
			},
		],
	});
}
