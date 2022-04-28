import { useMetaMaskExtension } from "@/providers/MetaMaskExtensionProvider";
import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { ethers } from "ethers";
import { MetaMaskAccount, WalletOption } from "@/types";
import { ensureEthereumChain } from "@/utils";

interface MetaMaskWalletContextType {
	connectWallet: (selectedWallet?: WalletOption) => Promise<void>;
	selectedAccount: MetaMaskAccount;
	wallet: ethers.providers.Web3Provider;
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
		async (selectedWallet: WalletOption) => {
			if (!extension) {
				return promptInstallExtension();
			}

			await ensureEthereumChain(extension, selectedWallet);

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
