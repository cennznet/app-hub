import { useMetaMaskExtension } from "@/providers/MetaMaskExtenstionProvider";
import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { ethers } from "ethers";
import { EthersProvider, MetaMaskAccount } from "@/types";
import { ensureEthereumChain } from "@/utils";

interface MetaMaskWalletContextType {
	connectWallet: (callback?: () => void) => Promise<void>;
	selectedAccount: MetaMaskAccount;
	wallet: EthersProvider;
}

const MetaMaskWalletContext = createContext<MetaMaskWalletContextType>(
	{} as MetaMaskWalletContextType
);

interface MetaMaskWalletProviderProps {}

const MetaMaskWalletProvider: FC<MetaMaskWalletProviderProps> = ({
	children,
}) => {
	const { extension, promptInstallExtension } = useMetaMaskExtension();
	const [wallet, setWallet] =
		useState<MetaMaskWalletContextType["wallet"]>(null);
	const [selectedAccount, setSelectedAccount] =
		useState<MetaMaskWalletContextType["selectedAccount"]>(null);

	const connectWallet = useCallback(
		async (callback) => {
			if (!extension) {
				callback?.();
				return promptInstallExtension();
			}

			await ensureEthereumChain(extension);

			const accounts = (await extension.request({
				method: "eth_requestAccounts",
			})) as string[];

			if (!accounts?.length)
				return alert(
					"Please create at least one account in MetaMask extension to continue."
				);

			setSelectedAccount({ address: accounts[0] });
			setWallet(new ethers.providers.Web3Provider(extension as any));
		},
		[extension, promptInstallExtension]
	);

	useEffect(() => {
		if (!extension) return;
		const checkAccounts = async () => {
			const accounts = (await extension.request({
				method: "eth_accounts",
			})) as string[];
			if (!accounts?.length) return;

			setSelectedAccount({ address: accounts[0] });
			setWallet(new ethers.providers.Web3Provider(extension as any));
		};

		checkAccounts();
	}, [extension]);

	useEffect(() => {
		if (!selectedAccount?.address || !extension) return;

		const onAccountsChanged = (accounts: string[]) => {
			if (!accounts?.length) return setSelectedAccount(null);
			setSelectedAccount({ address: accounts[0] });
		};

		extension.on("accountsChanged", onAccountsChanged);

		return () => {
			extension.removeListener("accountsChanged", onAccountsChanged);
		};
	}, [selectedAccount?.address, extension]);

	return (
		<MetaMaskWalletContext.Provider
			value={{ connectWallet, wallet, selectedAccount }}
		>
			{children}
		</MetaMaskWalletContext.Provider>
	);
};

export default MetaMaskWalletProvider;

export function useMetaMaskWallet(): MetaMaskWalletContextType {
	return useContext(MetaMaskWalletContext);
}
