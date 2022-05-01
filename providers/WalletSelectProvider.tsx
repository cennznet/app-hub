import { ChainOption, WalletOption } from "@/types";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { CENNZ_METAMASK_NETWORK, ETH_CHAIN_ID } from "@/constants";
import { useMetaMaskExtension } from "@/providers/MetaMaskExtensionProvider";

interface WalletSelectContextType {
	walletOpen: boolean;
	setWalletOpen: Dispatch<SetStateAction<boolean>>;

	selectedWallet: WalletOption;
	setSelectedWallet: Dispatch<SetStateAction<WalletOption>>;

	connectedChain: ChainOption;
	setConnectedChain: (chain: ChainOption) => void;
}

const WalletSelectContext = createContext<WalletSelectContextType>(
	{} as WalletSelectContextType
);

interface WalletSelectProviderProps {}

const WalletSelectProvider: FC<WalletSelectProviderProps> = ({ children }) => {
	const { extension } = useMetaMaskExtension();

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

		const onChainChanged = (chainId: string) => updateConnectedChain(chainId);
		extension.on("chainChanged", onChainChanged);

		return () => {
			extension.removeListener("chainChanged", onChainChanged);
		};
	}, [extension]);

	return (
		<WalletSelectContext.Provider
			value={{
				walletOpen,
				setWalletOpen,

				selectedWallet,
				setSelectedWallet,

				connectedChain,
				setConnectedChain,
			}}
		>
			{children}
		</WalletSelectContext.Provider>
	);
};

export default WalletSelectProvider;

export function useWalletSelect(): WalletSelectContextType {
	return useContext(WalletSelectContext);
}
