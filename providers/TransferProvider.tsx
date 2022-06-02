import {
	createContext,
	useContext,
	useState,
	FC,
	Dispatch,
	SetStateAction,
	useMemo,
} from "react";
import { CENNZAssets, ChainOption } from "@/types";
import {
	useTxStatus,
	TxStatusHook,
	TransferAssetsHook,
	useTransferAssets,
} from "@/hooks";
import isEthereumAddress from "@/utils/isEthereumAddress";

interface TransferContextType extends TxStatusHook, TransferAssetsHook {
	addressType: ChainOption;
	receiveAddress: string;
	setReceiveAddress: Dispatch<SetStateAction<string>>;

	supportedAssets: CENNZAssets;
}

const TransferContext = createContext<TransferContextType>(
	{} as TransferContextType
);

interface TransferProviderProps {
	supportedAssets: CENNZAssets;
}

const TransferProvider: FC<TransferProviderProps> = ({
	children,
	supportedAssets,
}) => {
	const [receiveAddress, setReceiveAddress] = useState<string>();
	const addressType = useMemo<ChainOption>(
		() => (isEthereumAddress(receiveAddress) ? "Ethereum" : "CENNZnet"),
		[receiveAddress]
	);

	return (
		<TransferContext.Provider
			value={{
				addressType,
				receiveAddress,
				setReceiveAddress,

				supportedAssets,

				...useTransferAssets(),

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
