import { CENNZ_METAMASK_NETWORK, ETH_CHAIN_ID } from "@/constants";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { WalletOption } from "@/types";

export default async function ensureEthereumChain(
	extension: MetaMaskInpageProvider,
	wallet: WalletOption
): Promise<void> {
	const ethChainId = await extension.request({ method: "eth_chainId" });

	if (
		(wallet !== "MetaMask" && ETH_CHAIN_ID === 1 && ethChainId === "0x1") ||
		(wallet !== "MetaMask" && ETH_CHAIN_ID === 42 && ethChainId === "0x2a") ||
		(wallet === "MetaMask" && ethChainId === CENNZ_METAMASK_NETWORK.chainId)
	)
		return;

	let chainId: string;
	if (wallet === "MetaMask") chainId = CENNZ_METAMASK_NETWORK.chainId;
	if (wallet !== "MetaMask") chainId = ETH_CHAIN_ID === 1 ? "0x1" : "0x2a";

	try {
		await extension.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId }],
		});
	} catch (error) {
		if (error.code === 4902) {
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
	}
}
