import { ETH_CHAIN_ID } from "@/constants";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ChainOption } from "@/types";
import { addCENNZnetToMetaMask } from "@/utils";

export default async function ensureEthereumChain(
	extension: MetaMaskInpageProvider,
	chain: ChainOption
): Promise<void> {
	if (chain === "CENNZnet") return addCENNZnetToMetaMask(extension);

	const ethChainId = await extension.request({ method: "eth_chainId" });

	if (
		(ETH_CHAIN_ID === 1 && ethChainId === "0x1") ||
		(ETH_CHAIN_ID === 42 && ethChainId === "0x2a")
	)
		return;

	await extension.request({
		method: "wallet_switchEthereumChain",
		params: [{ chainId: ETH_CHAIN_ID === 1 ? "0x1" : "0x2a" }],
	});
}
