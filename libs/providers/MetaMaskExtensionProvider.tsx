import type { PropsWithChildren } from "@/libs/types";

import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useUserAgent } from "@/libs/providers/UserAgentProvider";
import { MetaMaskInpageProvider } from "@metamask/providers";
import detectEthereumProvider from "@metamask/detect-provider";

interface MetaMaskExtensionContextType {
	promptInstallExtension: () => void;
	extension: MetaMaskInpageProvider;
	setEthereumProvider: () => void;
}

const MetaMaskExtensionContext = createContext<MetaMaskExtensionContextType>(
	{} as MetaMaskExtensionContextType
);

interface MetaMaskExtensionProviderProps extends PropsWithChildren {}

const MetaMaskExtensionProvider: FC<MetaMaskExtensionProviderProps> = ({
	children,
}) => {
	const { browser } = useUserAgent();
	const [extension, setExtension] =
		useState<MetaMaskExtensionContextType["extension"]>();

	const promptInstallExtension = useCallback(() => {
		const url =
			browser?.name === "Firefox"
				? "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
				: "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn";

		const confirmed = confirm(
			"Please install MetaMask Extension for your browser and create at least one account to continue."
		);

		if (!confirmed) return;

		window.open(url, "_blank");
	}, [browser]);

	const setEthereumProvider = useCallback(() => {
		setExtension(undefined);

		detectEthereumProvider({ mustBeMetaMask: true }).then(setExtension);
	}, []);

	useEffect(() => {
		setEthereumProvider();
	}, []);

	return (
		<MetaMaskExtensionContext.Provider
			value={{ extension, promptInstallExtension, setEthereumProvider }}
		>
			{children}
		</MetaMaskExtensionContext.Provider>
	);
};

export default MetaMaskExtensionProvider;

export function useMetaMaskExtension(): MetaMaskExtensionContextType {
	return useContext(MetaMaskExtensionContext);
}
