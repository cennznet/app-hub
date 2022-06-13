import { ETHEREUM_NETWORK } from "@/libs/constants";
import { MetaMaskInpageProvider } from "@metamask/providers";

export default async function ensureEthereumChain(
	extension: MetaMaskInpageProvider
): Promise<void> {
	const ethChainId = await extension.request({ method: "eth_chainId" });
	const chainId = ETHEREUM_NETWORK.ChainId.InHex;

	if (ethChainId === chainId) return;

	await extension.request({
		method: "wallet_switchEthereumChain",
		params: [{ chainId }],
	});
}
