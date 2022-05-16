import {
	createContext,
	useContext,
	useState,
	FC, useCallback, useEffect,
} from "react";
import {CENNZAsset, CENNZAssetBalance} from "@/types";
import {
	useTokenInput,
	useTokensFetcher,
	useTxStatus,
	TokenInputHook,
	TxStatusHook, useSelectedAccount,
} from "@/hooks";
import {useCENNZApi} from "@/providers/CENNZApiProvider";
import {useWalletProvider} from "@/providers/WalletProvider";
import fetchCENNZAssetBalances from "../utils/fetchCENNZAssetBalances";

type CENNZAssetId = CENNZAsset["assetId"];

interface TransferContextType extends TxStatusHook {
	transferableAssets: CENNZAsset[];
	transferableAssetSelects: TokenInputHook<CENNZAssetId>[];
	transferableAssetInputs: TokenInputHook<CENNZAssetId>[];
}

const TransferContext = createContext<TransferContextType>(
	{} as TransferContextType
);

interface TransferProviderProps {}

const TransferProvider: FC<TransferProviderProps> = ({ children }) => {
	const { api } = useCENNZApi();
	const { selectedWallet, setCENNZBalances } = useWalletProvider();
	const selectedAccount = useSelectedAccount();
	const [transferableAssets, setTransferableAssets] = useState<CENNZAssetBalance[]>();
	const [transferableAssetSelects, setTransferableAssetSelects] = useState<TokenInputHook<CENNZAssetId>[]>();
	const [transferableAssetInputs, setTransferableAssetInputs] = useState<TokenInputHook<CENNZAssetId>[]>();

	useCallback(async ( ) => {
		if (!api || !selectedWallet || !selectedAccount) return;

		const balances = await fetchCENNZAssetBalances(
			api,
			selectedAccount.address
		);
		const positiveBalances = balances.filter(balance => balance.value.toNumber() > 0);
		const allSelects = [];
		const allInputs = [];
		positiveBalances.forEach(balance => {
			const [currentSelect, currentInput] = useTokenInput(balance.assetId);
			allSelects.push(currentSelect);
			allInputs.push(currentInput);
		})
		setTransferableAssets(positiveBalances);
		setTransferableAssetSelects(allSelects);
		setTransferableAssetInputs(allInputs);

	}, [selectedAccount, selectedWallet, api, setCENNZBalances]);

	return (
		<TransferContext.Provider
			value={{
				transferableAssets,
				transferableAssetSelects,
				transferableAssetInputs,
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
