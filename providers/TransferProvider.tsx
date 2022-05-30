import {
	createContext,
	useContext,
	useState,
	FC,
	Dispatch,
	SetStateAction,
	useMemo,
} from "react";
import {
	CENNZAssetBalances,
	ChainOption,
	TransferAssets,
	TransferDisplayAssets,
} from "@/types";
import { useTxStatus, TxStatusHook, useTransferDisplayAssets } from "@/hooks";
import isEthereumAddress from "@/utils/isEthereumAddress";

interface TransferContextType extends TxStatusHook {
	receiveAddress: string;
	addressType: ChainOption;
	setReceiveAddress: Dispatch<SetStateAction<string>>;

	displayAssets: TransferDisplayAssets;
	addDisplayAsset: () => void;
	removeDisplayAsset: (index: number) => void;
	resetDisplayAssets: () => void;

	selectedAssets: TransferAssets;
	setSelectedAssets: Dispatch<SetStateAction<TransferAssets>>;

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
	const [selectedAssets, setSelectedAssets] = useState<TransferAssets>();

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

				...useTransferDisplayAssets(),

				selectedAssets,
				setSelectedAssets,

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
