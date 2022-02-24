import {
	InjectedExtension,
	InjectedAccountWithMeta,
} from "@polkadot/extension-inject/types";
import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
	useCallback,
} from "react";
import type * as Extension from "@polkadot/extension-dapp";
import { useUserAgent } from "@/providers/UserAgentProvider";

type ExtensionContext = typeof Extension & {
	accounts: Array<InjectedAccountWithMeta>;
	extension: InjectedExtension;
	promptInstallExtension: () => void;
};

const CENNZExtensionContext = createContext<ExtensionContext>(
	{} as ExtensionContext
);

type ProviderProps = {};

export default function CENNZExtensionProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	const { browser } = useUserAgent();
	const [module, setModule] = useState<typeof Extension>();
	const [extension, setExtension] = useState<InjectedExtension>();
	const [accounts, setAccounts] = useState<Array<InjectedAccountWithMeta>>();

	const promptInstallExtension = useCallback(async () => {
		const url =
			browser?.name === "Firefox"
				? "https://addons.mozilla.org/en-US/firefox/addon/cennznet-browser-extension/"
				: "https://chrome.google.com/webstore/detail/cennznet-extension/feckpephlmdcjnpoclagmaogngeffafk";

		const confirmed = confirm(
			"Please install CENNZnet Extension for your browser and create at least one account to continue."
		);

		if (!confirmed) return;

		window.open(url, "_blank");
	}, [browser]);

	useEffect(() => {
		import("@polkadot/extension-dapp").then(setModule);
	}, []);

	useEffect(() => {
		if (!module) return;

		const getExtension = async () => {
			const { web3Enable, web3FromSource } = module;
			await web3Enable("CENNZnet Hub");
			const extension = await web3FromSource("cennznet-extension").catch(
				() => null
			);

			setExtension(extension);
		};

		getExtension();
	}, [module]);

	useEffect(() => {
		if (!module || !extension) return;
		let unsubscibre: () => void;

		const fetchAccounts = async () => {
			const { web3Enable, web3Accounts, web3AccountsSubscribe } = module;

			await web3Enable("CENNZnet Hub");
			const accounts = (await web3Accounts()) || [];
			if (!accounts.length)
				return alert(
					"Please create at least one account in CENNZnet extension to continue."
				);

			setAccounts(accounts);

			unsubscibre = await web3AccountsSubscribe((accounts) => {
				setAccounts([...accounts]);
			});
		};

		fetchAccounts();

		return unsubscibre;
	}, [module, extension]);

	return (
		<CENNZExtensionContext.Provider
			value={{ ...module, accounts, extension, promptInstallExtension }}
		>
			{children}
		</CENNZExtensionContext.Provider>
	);
}

export function useCENNZExtension(): ExtensionContext {
	return useContext(CENNZExtensionContext);
}
