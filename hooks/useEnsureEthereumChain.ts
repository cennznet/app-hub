import { ETH_CHAIN_ID } from "@/constants";
import { useCallback } from "react";
import { useMetaMaskExtension } from "@/providers/MetaMaskExtensionProvider";
import { useSectionUri } from "@/hooks/index";

export default function useEnsureEthereumChain(): () => Promise<void> {
	const { extension } = useMetaMaskExtension();
	const section = useSectionUri();

	return useCallback(async () => {
		if (!extension || section !== "bridge") return;

		const chainId = `0x${ETH_CHAIN_ID.toString(16)}`;
		const ethChainId = await extension.request({ method: "eth_chainId" });

		if (ethChainId === chainId) return;

		await extension.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId }],
		});
	}, [extension, section]);
}
