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
import { useWalletSelect } from "./WalletSelectProvider";
import { useSelectedAccount } from "@/hooks";

interface WalletContext {
	balances: CENNZAssetBalance[];
	updateBalances: Function;
	selectedAccount: InjectedAccountWithMeta;
	wallet: InjectedExtension;
	connectWallet: (callback?: () => void) => Promise<void>;
	disconnectWallet: () => void;
	selectAccount: (account: InjectedAccountWithMeta) => void;
}

const CENNZWalletContext = createContext<WalletContext>({} as WalletContext);

interface ProviderProps {}

export default function CENNZWalletProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	const { api } = useCENNZApi();
	const { selectedWallet } = useWalletSelect();
	const { promptInstallExtension, getInstalledExtension, accounts } =
		useCENNZExtension();
	const [balances, setBalances] = useState<CENNZAssetBalance[]>(null);
	const [wallet, setWallet] = useState<InjectedExtension>(null);
	const [CENNZAccount, setAccount] = useState<InjectedAccountWithMeta>(null);
	const selectedAccount = useSelectedAccount();

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
		setAccount(null);
		setBalances(null);
	}, []);

	const selectAccount = useCallback((account) => {
		setAccount(account);
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
		if (!wallet || !accounts || !selectAccount || !selectedWallet) return;

		const storedAccount = store.get("CENNZNET-ACCOUNT");
		if (!storedAccount) return selectAccount(accounts[0]);

		const matchedAccount = accounts.find(
			(account) => account.address === storedAccount.address
		);
		if (!matchedAccount) return selectAccount(accounts[0]);

		selectAccount(matchedAccount);
	}, [wallet, accounts, selectAccount, selectedWallet]);

	//3. Fetch asset balance
	const updateBalances = useCallback(async () => {
		if (
			!api ||
			!selectedWallet ||
			(selectedWallet === "MetaMask" && !selectedAccount) ||
			(selectedWallet === "CENNZnet" && !CENNZAccount)
		)
			return;
		const updateCENNZBalances = async () => {
			const balances = await fetchCENNZAssetBalances(
				api,
				selectedWallet === "CENNZnet"
					? CENNZAccount.address
					: selectedAccount.address
			);

			setBalances(balances);
		};

		return updateCENNZBalances();
	}, [CENNZAccount, selectedAccount, selectedWallet, api]);

	useEffect(() => {
		if (!selectedWallet) return;
		void updateBalances?.();
	}, [updateBalances, selectedWallet]);

	return (
		<CENNZWalletContext.Provider
			value={{
				balances,
				updateBalances,
				selectedAccount: CENNZAccount,
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
