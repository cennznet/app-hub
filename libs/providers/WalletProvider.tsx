import { CENNZAssetBalance, ChainOption, WalletOption } from "@/libs/types";
import {
	createContext,
	memo,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useEffect,
	useState,
	PropsWithChildren,
} from "react";
import { CENNZ_METAMASK_NETWORK, ETH_CHAIN_ID } from "@/libs/constants";
import { useMetaMaskExtension } from "@providers/MetaMaskExtensionProvider";

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

interface WalletProviderProps {}

const WalletProvider: FC<PropsWithChildren<WalletProviderProps>> = ({
	children,
}) => {
	const { extension } = useMetaMaskExtension();

	const [walletOpen, setWalletOpen] = useState<boolean>(false);
	const [selectedWallet, setSelectedWallet] = useState<WalletOption>();
	const [connectedChain, setConnectedChain] = useState<ChainOption>();
	const [cennzBalances, setCENNZBalances] = useState<CENNZAssetBalance[]>(null);

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

export default memo(WalletProvider);

export function useWalletProvider(): WalletContextType {
	return useContext(WalletContext);
}
