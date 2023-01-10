import type {
	CENNZAssetBalance,
	ChainOption,
	WalletOption,
	PropsWithChildren,
} from "@/libs/types";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { CENNZ_NETWORK, ETHEREUM_NETWORK } from "@/libs/constants";
import { useMetaMaskExtension } from "@/libs/providers/MetaMaskExtensionProvider";
import store from "store";

interface WalletContextType {
	walletOpen: boolean;
	setWalletOpen: Dispatch<SetStateAction<boolean>>;

	selectedWallet: WalletOption;
	setSelectedWallet: Dispatch<SetStateAction<WalletOption>>;

	connectedChain: ChainOption;
	setConnectedChain: (chain: ChainOption) => void;

	cennzBalances: CENNZAssetBalance[];
	setCENNZBalances: Dispatch<SetStateAction<CENNZAssetBalance[]>>;
}

const WalletContext = createContext<WalletContextType>({} as WalletContextType);

interface WalletProviderProps extends PropsWithChildren {}

const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
	const { extension } = useMetaMaskExtension();

	const [walletOpen, setWalletOpen] = useState<boolean>(false);
	const [selectedWallet, setSelectedWallet] = useState<WalletOption>();
	const [connectedChain, setConnectedChain] = useState<ChainOption>();
	const [cennzBalances, setCENNZBalances] = useState<CENNZAssetBalance[]>(null);

	useEffect(() => {
		if (!selectedWallet) return setSelectedWallet(store.get("SELECTED-WALLET"));

		store.set("SELECTED-WALLET", selectedWallet);
	}, [selectedWallet]);

	const updateConnectedChain = (chainId: string) => {
		if (chainId === CENNZ_NETWORK.ChainId.InHex)
			return setConnectedChain("CENNZnet");
		if (chainId === ETHEREUM_NETWORK.ChainId.InHex)
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

	return (
		<WalletContext.Provider
			value={{
				walletOpen,
				setWalletOpen,

				selectedWallet,
				setSelectedWallet,

				connectedChain,
				setConnectedChain,

				cennzBalances,
				setCENNZBalances,
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
