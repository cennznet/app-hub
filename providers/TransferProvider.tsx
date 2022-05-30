import {
	createContext,
	useContext,
	useState,
	FC,
	Dispatch,
	SetStateAction,
	useMemo,
} from "react";
import { CENNZAssetBalances, ChainOption } from "@/types";
import { useTxStatus, TxStatusHook } from "@/hooks";
import isEthereumAddress from "@/utils/isEthereumAddress";

interface TransferContextType extends TxStatusHook {
	receiveAddress: string;
	addressType: ChainOption;
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

	const addressType = useMemo<ChainOption>(
		() => (isEthereumAddress(receiveAddress) ? "Ethereum" : "CENNZnet"),
		[receiveAddress]
	);

	return (
		<TransferContext.Provider
			value={{
				receiveAddress,
				addressType,
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
