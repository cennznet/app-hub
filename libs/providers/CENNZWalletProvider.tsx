import type { PropsWithChildren } from "@/libs/types";

import {
	InjectedExtension,
	InjectedAccountWithMeta,
} from "@polkadot/extension-inject/types";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	FC,
} from "react";
import store from "store";
import { useCENNZExtension } from "@/libs/providers/CENNZExtensionProvider";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { useWalletProvider } from "@/libs/providers/WalletProvider";
import { useUpdateCENNZBalances } from "@/libs/hooks";

interface WalletContext {
	selectedAccount: InjectedAccountWithMeta;
	wallet: InjectedExtension;
	connectWallet: (callback?: () => void) => Promise<void>;
	disconnectWallet: () => void;
	selectAccount: (account: InjectedAccountWithMeta) => void;
}

const CENNZWalletContext = createContext<WalletContext>({} as WalletContext);

interface CENNZWalletProviderProps extends PropsWithChildren {}

const CENNZWalletProvider: FC<CENNZWalletProviderProps> = ({ children }) => {
	const { api } = useCENNZApi();
	const { selectedWallet, setCENNZBalances } = useWalletProvider();
	const { promptInstallExtension, getInstalledExtension, accounts } =
		useCENNZExtension();
	const [wallet, setWallet] = useState<InjectedExtension>(null);
	const [cennzAccount, setCENNZAccount] =
		useState<InjectedAccountWithMeta>(null);

	const updateCENNZBalances = useUpdateCENNZBalances();

	const connectWallet = useCallback(
		async (callback) => {
			if (!api) return;

			const extension = await getInstalledExtension?.();

			if (!extension) {
				callback?.();
				return promptInstallExtension();
			}

			callback?.();
			setWallet(extension);
			store.set("CENNZNET-EXTENSION", extension);
		},
		[api, getInstalledExtension, promptInstallExtension]
	);

	const disconnectWallet = useCallback(() => {
		store.remove("CENNZNET-EXTENSION");
		store.remove("CENNZNET-ACCOUNT");
		setWallet(null);
		setCENNZAccount(null);
		setCENNZBalances(null);
	}, [setCENNZBalances]);

	const selectAccount = useCallback((account) => {
		setCENNZAccount(account);
		store.set("CENNZNET-ACCOUNT", account);
	}, []);

	// 1. Restore the wallet from the store if it exists
	useEffect(() => {
		async function restoreWallet() {
			const storedWallet = store.get("CENNZNET-EXTENSION");
			if (!storedWallet) return disconnectWallet();
			const extension = await getInstalledExtension?.();
			setWallet(extension);
		}

		void restoreWallet();
	}, [disconnectWallet, getInstalledExtension]);

	// 2. Pick the right account once a `wallet` has been set
	useEffect(() => {
		if (!wallet || !accounts || !selectAccount || selectedWallet !== "CENNZnet")
			return;

		const storedAccount = store.get("CENNZNET-ACCOUNT");
		if (!storedAccount) return selectAccount(accounts[0]);

		const matchedAccount = accounts.find(
			(account) => account.address === storedAccount.address
		);
		if (!matchedAccount) return selectAccount(accounts[0]);

		selectAccount(matchedAccount);
	}, [wallet, accounts, selectAccount, selectedWallet]);

	useEffect(() => {
		if (!selectedWallet) return;
		void updateCENNZBalances?.();
	}, [updateCENNZBalances, selectedWallet]);

	return (
		<CENNZWalletContext.Provider
			value={{
				selectedAccount: cennzAccount,
				wallet,
				connectWallet,
				disconnectWallet,
				selectAccount,
			}}
		>
			{children}
		</CENNZWalletContext.Provider>
	);
};

export default CENNZWalletProvider;

export function useCENNZWallet(): WalletContext {
	return useContext(CENNZWalletContext);
}
