import { WalletOption } from "@/types";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useState,
} from "react";

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
	const [walletOpen, setWalletOpen] = useState<boolean>(false);
	const [selectedWallet, setSelectedWallet] = useState<WalletOption>();

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
