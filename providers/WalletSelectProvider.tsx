import { WalletOption } from "@/types";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { useCENNZWallet } from "./CENNZWalletProvider";
import { useMetaMaskWallet } from "./MetaMaskWalletProvider";

interface WalletSelectContextType {
	walletOpen: boolean;
	setWalletOpen: Dispatch<SetStateAction<boolean>>;

	selectedWallet: WalletOption;
	setSelectedWallet: Dispatch<SetStateAction<WalletOption>>;
}

const WalletSelectContext = createContext<WalletSelectContextType>(
	{} as WalletSelectContextType
);

interface WalletSelectProviderProps {}

const WalletSelectProvider: FC<WalletSelectProviderProps> = ({ children }) => {
	const { connectWallet: connectCENNZWallet } = useCENNZWallet();
	const { connectWallet: connectMetaMaskWallet } = useMetaMaskWallet();
	const [walletOpen, setWalletOpen] = useState<boolean>(false);
	const [selectedWallet, setSelectedWallet] = useState<WalletOption>();

	useEffect(() => {
		if (!selectedWallet) return;

		const connectWallet = async (wallet: WalletOption) => {
			if (wallet === "CENNZnet") return connectCENNZWallet();
			if (wallet === "MetaMask") return connectMetaMaskWallet();
		};

		void connectWallet(selectedWallet);
	}, [selectedWallet, connectCENNZWallet, connectMetaMaskWallet]);

	return (
		<WalletSelectContext.Provider
			value={{
				walletOpen,
				setWalletOpen,

				selectedWallet,
				setSelectedWallet,
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
