import type { PropsWithChildren } from "@/libs/types";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	FC,
} from "react";
import type * as Extension from "@polkadot/extension-dapp";
import { useUserAgent } from "@/libs/providers/UserAgentProvider";
import { useWalletProvider } from "@/libs/providers/WalletProvider";
import {
	InjectedExtension,
	InjectedAccountWithMeta,
} from "@polkadot/extension-inject/types";

type ExtensionDapp = typeof Extension;

declare global {
	interface Window {
		injectedWeb3?: {
			"cennznet-extension"?: {
				enable: (name: string) => Promise<InjectedExtension>;
			};
		};
	}
}

interface ExtensionContext {
	accounts: InjectedAccountWithMeta[];
	extension: InjectedExtension;
	promptInstallExtension: () => void;
}

const CENNZExtensionContext = createContext<ExtensionContext>(
	{} as ExtensionContext
);

interface CENNZExtensionProviderProps extends PropsWithChildren {}

const CENNZExtensionProvider: FC<CENNZExtensionProviderProps> = ({
	children,
}) => {
	const { browser, os } = useUserAgent();
	const { selectedWallet } = useWalletProvider();
	const [accounts, setAccounts] = useState<Array<InjectedAccountWithMeta>>();
	const [extension, setExtension] = useState<InjectedExtension>();

	const promptInstallExtension = useCallback(() => {
		if (
			browser.name === "Safari" ||
			os.name === "iOS" ||
			os.name === "Android"
		) {
			return alert(
				"Sorry, this browser is not supported by App Hub. To use App Hub, please switch to Chrome or Firefox browsers on a Mac or PC."
			);
		}

		const url =
			browser?.name === "Firefox"
				? "https://addons.mozilla.org/en-US/firefox/addon/cennznet-browser-extension/"
				: "https://chrome.google.com/webstore/detail/cennznet-extension/feckpephlmdcjnpoclagmaogngeffafk";

		const confirmed = confirm(
			"Please install CENNZnet Extension for your browser and create at least one account to continue."
		);

		if (!confirmed) return;

		window.open(url, "_blank");
	}, [browser, os]);

	useEffect(() => {
		const fetchExtension = async () => {
			const intervalId = setInterval(async () => {
				const { injectedWeb3 } = window;

				if (injectedWeb3) clearInterval(intervalId);
				const extension = await window.injectedWeb3[
					"cennznet-extension"
				].enable("CENNZnet App Hub");
				setExtension(extension);
			}, 500);
		};

		void fetchExtension();
	}, []);

	useEffect(() => {
		if (!extension || selectedWallet !== "CENNZnet") return;
		let unsubscribe: () => void;

		const fetchAccounts = async () => {
			const accounts = (await extension.accounts.get()).map((account) => ({
				address: account.address,
				meta: account,
			})) as unknown as InjectedAccountWithMeta[];

			if (!accounts.length)
				return alert(
					"Please create at least one account in CENNZnet extension to continue."
				);

			setAccounts(accounts);

			unsubscribe = extension.accounts.subscribe((accounts) => {
				setAccounts(
					accounts.map((account) => ({
						address: account.address,
						meta: account,
					})) as unknown as InjectedAccountWithMeta[]
				);
			});
		};

		void fetchAccounts();

		return unsubscribe;
	}, [extension, selectedWallet]);

	return (
		<CENNZExtensionContext.Provider
			value={{
				accounts,
				extension,
				promptInstallExtension,
			}}
		>
			{children}
		</CENNZExtensionContext.Provider>
	);
};

export default CENNZExtensionProvider;

export function useCENNZExtension(): ExtensionContext {
	return useContext(CENNZExtensionContext);
}
