import {
	createContext,
	useContext,
	useState,
	FC,
	Dispatch,
	SetStateAction,
} from "react";
import { CENNZAssetBalances } from "@/types";
import { useTxStatus, TxStatusHook } from "@/hooks";

interface TransferContextType extends TxStatusHook {
	receiveAddress: string;
	setReceiveAddress: Dispatch<SetStateAction<string>>;

	transferAssets: CENNZAssetBalances;
	setTransferAssets: Dispatch<SetStateAction<CENNZAssetBalances>>;
}

const TransferContext = createContext<TransferContextType>(
	{} as TransferContextType
);

interface TransferProviderProps {}

const TransferProvider: FC<TransferProviderProps> = ({ children }) => {
	const [receiveAddress, setReceiveAddress] = useState<string>();
	const [transferAssets, setTransferAssets] = useState<CENNZAssetBalances>();

	return (
		<TransferContext.Provider
			value={{
				receiveAddress,
				setReceiveAddress,

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
