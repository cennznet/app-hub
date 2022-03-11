import {
	InjectedExtension,
	InjectedAccountWithMeta,
} from "@polkadot/extension-inject/types";
import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import store from "store";
import { useCENNZExtension } from "@/providers/CENNZExtensionProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import fetchCENNZAssetBalances from "@/utils/fetchCENNZAssetBalances";
import { CENNZAssetBalance } from "@/types";

type WalletContext = {
	balances: CENNZAssetBalance[];
	updateBalances: Function;
	selectedAccount: InjectedAccountWithMeta;
	wallet: InjectedExtension;
	connectWallet: (callback?: () => void) => Promise<void>;
	disconnectWallet: () => void;
	selectAccount: (account: InjectedAccountWithMeta) => void;
};

const CENNZWalletContext = createContext<WalletContext>({
	balances: null,
	updateBalances: null,
	selectedAccount: null,
	wallet: null,
	connectWallet: null,
	disconnectWallet: null,
	selectAccount: null,
});

type ProviderProps = {};

export default function CENNZWalletProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	const { api } = useCENNZApi();
	const { promptInstallExtension, extension, accounts } = useCENNZExtension();
	const [balances, setBalances] = useState<CENNZAssetBalance[]>(null);
	const [wallet, setWallet] = useState<InjectedExtension>(null);
	const [selectedAccount, setAccount] = useState<InjectedAccountWithMeta>(null);

	const connectWallet = useCallback(
		async (callback) => {
			if (!api) return;

			if (!extension) {
				callback?.();
				return promptInstallExtension();
			}

			callback?.();
			setWallet(extension);
			store.set("CENNZNET-EXTENSION", extension);
		},
		[promptInstallExtension, extension, api]
	);

	const disconnectWallet = useCallback(() => {
		store.remove("CENNZNET-EXTENSION");
		store.remove("CENNZNET-ACCOUNT");
		setWallet(null);
		setAccount(null);
		setBalances(null);
	}, []);

	const selectAccount = useCallback((account) => {
		setAccount(account);
		store.set("CENNZNET-ACCOUNT", account);
	}, []);

	// 1. Restore the wallet from the store if it exists
	useEffect(() => {
		if (extension === null) return disconnectWallet();
		const storedWallet = store.get("CENNZNET-EXTENSION");
		if (!storedWallet) return;
		setWallet(extension);
	}, [extension, disconnectWallet]);

	// 2. Pick the right account once a `wallet` has been set
	useEffect(() => {
		if (!wallet || !accounts || !selectAccount) return;

		const storedAccount = store.get("CENNZNET-ACCOUNT");
		if (!storedAccount) return selectAccount(accounts[0]);

		const matchedAccount = accounts.find(
			(account) => account.address === storedAccount.address
		);
		if (!matchedAccount) return selectAccount(accounts[0]);

		selectAccount(matchedAccount);
	}, [wallet, accounts, selectAccount]);

	//3. Fetch asset balance
	const updateBalances = useCallback(async () => {
		if (!selectedAccount?.address || !api) return;
		(async () => {
			const balances = await fetchCENNZAssetBalances(
				api,
				selectedAccount.address
			);

			setBalances(balances);
		})();
	}, [selectedAccount, api]);

	useEffect(() => {
		(async () => {
			await updateBalances();
		})();
	}, [updateBalances]);

	return (
		<CENNZWalletContext.Provider
			value={{
				balances,
				updateBalances,
				selectedAccount,
				wallet,
				connectWallet,
				disconnectWallet,
				selectAccount,
			}}
		>
			{children}
		</CENNZWalletContext.Provider>
	);
}

export function useCENNZWallet(): WalletContext {
	return useContext(CENNZWalletContext);
}
