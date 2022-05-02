import { MetaMaskInpageProvider } from "@metamask/providers";
import { CENNZ_METAMASK_NETWORK, CENNZ_NETWORK } from "@/constants";

export default async function addCENNZnetToMetaMask(
	extension: MetaMaskInpageProvider
): Promise<void> {
	const ethChainId = await extension.request({ method: "eth_chainId" });

	if (ethChainId === CENNZ_METAMASK_NETWORK.chainId) return;

	try {
		await extension.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: CENNZ_METAMASK_NETWORK.chainId }],
		});
	} catch (error) {
		if (error.code === 4902) {
			await global.ethereum.request({
				method: "wallet_addEthereumChain",
				params: [
					{
						chainId: CENNZ_METAMASK_NETWORK.chainId,
						blockExplorerUrls: [`https://${CENNZ_NETWORK}.uncoverexplorer.com`],
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
	}
}
