import {
	createContext,
	useContext,
	useState,
	FC,
	useEffect,
	Dispatch,
	SetStateAction,
} from "react";
import { CENNZAssetBalance } from "@/types";
import { useTxStatus, TxStatusHook, useSelectedAccount } from "@/hooks";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useWalletProvider } from "@/providers/WalletProvider";
import fetchCENNZAssetBalances from "../utils/fetchCENNZAssetBalances";

interface TransferContextType extends TxStatusHook {
	transferableAssets: CENNZAssetBalance[];
	receiveAddress: string;
	setReceiveAddress: Dispatch<SetStateAction<string>>;
	transferAssets: CENNZAssetBalance[];
	setTransferAssets: Dispatch<SetStateAction<CENNZAssetBalance[]>>;
}

const TransferContext = createContext<TransferContextType>(
	{} as TransferContextType
);

interface TransferProviderProps {}

const TransferProvider: FC<TransferProviderProps> = ({ children }) => {
	const { api } = useCENNZApi();
	const { selectedWallet, setCENNZBalances } = useWalletProvider();
	const selectedAccount = useSelectedAccount();
	const [transferableAssets, setTransferableAssets] =
		useState<CENNZAssetBalance[]>();
	const [receiveAddress, setReceiveAddress] = useState<string>();
	const [transferAssets, setTransferAssets] = useState<CENNZAssetBalance[]>();

	useEffect(() => {
		if (!api || !selectedWallet || !selectedAccount) return;
		const setAssets = async () => {
			const balances = await fetchCENNZAssetBalances(
				api,
				selectedAccount.address
			);
			const positiveBalances = balances.filter(
				(balance) => balance.value.toNumber() > 0
			);
			setTransferableAssets(positiveBalances);
		};
		setAssets().catch((err) => console.error(err.message));
	}, [selectedAccount, selectedWallet, api, setCENNZBalances]);

	return (
		<TransferContext.Provider
			value={{
				transferableAssets,
				setReceiveAddress,
				receiveAddress,
				transferAssets,
				setTransferAssets,
				...useTxStatus(),
			}}
		>
			{children}
		</TransferContext.Provider>
	);
};

export default TransferProvider;

export const useTransfer = (): TransferContextType =>
	useContext(TransferContext);
