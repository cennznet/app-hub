import {
	InjectedExtension,
	InjectedAccountWithMeta,
} from "@polkadot/extension-inject/types";
import {
	createContext,
	memo,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
	useCallback,
	useMemo,
} from "react";
import type * as Extension from "@polkadot/extension-dapp";
import { useUserAgent } from "@/providers/UserAgentProvider";
import { useWalletProvider } from "./WalletProvider";

interface ExtensionContext {
	accounts: InjectedAccountWithMeta[];
	promptInstallExtension: () => void;
	getInstalledExtension: () => Promise<InjectedExtension>;
}

const CENNZExtensionContext = createContext<ExtensionContext>(
	{} as ExtensionContext
);

type ProviderProps = {};

function CENNZExtensionProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	const { browser, os } = useUserAgent();
	const { selectedWallet } = useWalletProvider();
	const [module, setModule] = useState<typeof Extension>();
	const [accounts, setAccounts] = useState<Array<InjectedAccountWithMeta>>();

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
		import("@polkadot/extension-dapp").then(setModule);
	}, []);

	const getInstalledExtension = useMemo(() => {
		if (!module) return;

		return async () => {
			const { web3Enable, web3FromSource } = module;
			await web3Enable("CENNZnet App Hub");
			return await web3FromSource("cennznet-extension").catch(() => null);
		};
	}, [module]);

	useEffect(() => {
		if (!module || selectedWallet !== "CENNZnet") return;
		let unsubscribe: () => void;

		const fetchAccounts = async () => {
			const { web3Enable, web3Accounts, web3AccountsSubscribe } = module;

			await web3Enable("CENNZnet App Hub");
			const accounts = (await web3Accounts()) || [];
			if (!accounts.length)
				return alert(
					"Please create at least one account in CENNZnet extension to continue."
				);

			setAccounts(accounts);

			unsubscribe = await web3AccountsSubscribe((accounts) => {
				setAccounts([...accounts]);
			});
		};

		void fetchAccounts();

		return unsubscribe;
	}, [module, selectedWallet]);

	return (
		<CENNZExtensionContext.Provider
			value={{
				...module,
				accounts,
				getInstalledExtension,
				promptInstallExtension,
			}}
		>
			{children}
		</CENNZExtensionContext.Provider>
	);
}

export default memo(CENNZExtensionProvider);

export function useCENNZExtension(): ExtensionContext {
	return useContext(CENNZExtensionContext);
}
