import { ETH_CHAIN_ID } from "@/constants";
import { MetaMaskInpageProvider } from "@metamask/providers";

export default async function ensureEthereumChain(
	extension: MetaMaskInpageProvider
): Promise<void> {
	const ethChainId = await extension.request({ method: "eth_chainId" });
	const chainId = `0x${ETH_CHAIN_ID.toString(16)}`;

	if (ethChainId === chainId) return;

	await extension.request({
		method: "wallet_switchEthereumChain",
		params: [{ chainId }],
	});
}
