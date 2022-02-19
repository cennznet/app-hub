import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { useDappModule } from "@/providers/DappModuleProvider";
import { useWallet } from "@/providers/SupportedWalletProvider";

const Web3AccountsContext = createContext<Array<InjectedAccountWithMeta>>(null);

type ProviderProps = {};

export default function Web3AccountsProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	const { web3Enable, web3Accounts, web3AccountsSubscribe } = useDappModule();
	const { selectAccount } = useWallet();
	const [accounts, setAccounts] =
		useState<Array<InjectedAccountWithMeta>>(null);

	useEffect(() => {
		if (!web3Enable) return;

		let unsubscribe: () => void;

		async function fetchAndSubscribeAccounts() {
			await web3Enable("CENNZnet Hub");
			const accounts = await web3Accounts();
			setAccounts(accounts);
			selectAccount(accounts[0]);

			unsubscribe = await web3AccountsSubscribe(setAccounts);
		}

		fetchAndSubscribeAccounts();

		return unsubscribe;
	}, [web3Enable, web3Accounts, web3AccountsSubscribe, selectAccount]);

	return (
		<Web3AccountsContext.Provider value={accounts}>
			{children}
		</Web3AccountsContext.Provider>
	);
}

export function useWeb3Accounts(): Array<InjectedAccountWithMeta> {
	return useContext(Web3AccountsContext);
}
