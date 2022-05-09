import { ChainOption, WalletOption } from "@/types";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { CENNZ_METAMASK_NETWORK, ETH_CHAIN_ID } from "@/constants";
import { useMetaMaskExtension } from "@/providers/MetaMaskExtensionProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import fetchCENNZAssetBalances from "@/utils/fetchCENNZAssetBalances";
import { useSelectedAccount } from "@/hooks";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";

interface WalletContextType {
	walletOpen: boolean;
	setWalletOpen: Dispatch<SetStateAction<boolean>>;

	selectedWallet: WalletOption;
	setSelectedWallet: Dispatch<SetStateAction<WalletOption>>;

	connectedChain: ChainOption;
	setConnectedChain: (chain: ChainOption) => void;

	updateCENNZBalances: Function;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

interface WalletProviderProps {}

const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
	const { extension } = useMetaMaskExtension();
	const { setBalances } = useCENNZWallet();
	const { api } = useCENNZApi();
	const selectedAccount = useSelectedAccount();

	const [walletOpen, setWalletOpen] = useState<boolean>(false);
	const [selectedWallet, setSelectedWallet] = useState<WalletOption>();
	const [connectedChain, setConnectedChain] = useState<ChainOption>();

	const updateConnectedChain = (chainId: string) => {
		if (chainId === CENNZ_METAMASK_NETWORK.chainId)
			return setConnectedChain("CENNZnet");
		if (chainId === (ETH_CHAIN_ID === 1 ? "0x1" : "0x2a"))
			return setConnectedChain("Ethereum");
		setConnectedChain(null);
	};

	useEffect(() => {
		if (!extension) return;

		if (extension.isConnected())
			updateConnectedChain(
				`0x${Number(extension.networkVersion).toString(16)}`
			);

		const onChainChanged = (chainId: string) => {
			if (!chainId) return;
			updateConnectedChain(chainId);
		};
		extension.on("chainChanged", onChainChanged);

		return () => {
			extension.removeListener("chainChanged", onChainChanged);
		};
	}, [extension]);

	const updateCENNZBalances = useCallback(async () => {
		if (!api || !selectedWallet || !selectedAccount) return;

		const balances = await fetchCENNZAssetBalances(
			api,
			selectedAccount.address
		);

		setBalances(balances);
	}, [selectedAccount, selectedWallet, api, setBalances]);

	useEffect(() => {
		if (!selectedWallet || !selectedAccount) return;
		void updateCENNZBalances?.();
	}, [updateCENNZBalances, selectedWallet, selectedAccount]);

	return (
		<WalletContext.Provider
			value={{
				walletOpen,
				setWalletOpen,

				selectedWallet,
				setSelectedWallet,

				connectedChain,
				setConnectedChain,

				updateCENNZBalances,
			}}
		>
			{children}
		</WalletContext.Provider>
	);
};

export default WalletProvider;

export function useWalletProvider(): WalletContextType {
	return useContext(WalletContext);
}
