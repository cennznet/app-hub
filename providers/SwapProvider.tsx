import {
	createContext,
	useContext,
	useState,
	SetStateAction,
	Dispatch,
	FC,
	ReactElement,
} from "react";
import { CENNZAsset } from "@/types";
import { fetchSwapAssets } from "@/utils";
import { useTokensFetcher } from "@/hooks";
import { CENNZ_ASSET_ID, CPAY_ASSET_ID } from "@/constants";
import { useTokenInput, TokenInputHookType } from "@/hooks";

type CENNZAssetId = CENNZAsset["assetId"];

interface TxStatus {
	status: "in-progress" | "success" | "fail";
	message: string | ReactElement;
}

interface SwapContextType {
	exchangeAssets: CENNZAsset[];
	receiveAssets: CENNZAsset[];
	cpayAsset: CENNZAsset;
	setReceiveAssets: Dispatch<SetStateAction<CENNZAsset[]>>;
	exchangeToken: TokenInputHookType<CENNZAssetId>[0];
	exchangeValue: TokenInputHookType<CENNZAssetId>[1];
	receiveToken: TokenInputHookType<CENNZAssetId>[0];
	receiveValue: TokenInputHookType<CENNZAssetId>[1];
	exchangeAsset: CENNZAsset;
	receiveAsset: CENNZAsset;
	slippage: string;
	setSlippage: Dispatch<SetStateAction<string>>;
	txStatus: TxStatus;
	setTxStatus: Dispatch<SetStateAction<TxStatus>>;
}

const SwapContext = createContext<SwapContextType>({} as SwapContextType);

interface SwapProviderProps {
	supportedAssets: CENNZAsset[];
}

const SwapProvider: FC<SwapProviderProps> = ({ supportedAssets, children }) => {
	const [exchangeAssets] = useTokensFetcher<CENNZAsset[]>(
		fetchSwapAssets,
		supportedAssets
	);
	const [receiveAssets, setReceiveAssets] =
		useState<CENNZAsset[]>(exchangeAssets);

	const cennzAsset = exchangeAssets?.find(
		(token) => token.assetId === CENNZ_ASSET_ID
	);
	const cpayAsset = exchangeAssets?.find(
		(token) => token.assetId === CPAY_ASSET_ID
	);

	const [exchangeToken, exchangeValue] = useTokenInput(cennzAsset.assetId);
	const [receiveToken, receiveValue] = useTokenInput(cpayAsset.assetId);

	const exchangeAsset = exchangeAssets?.find(
		(token) => token.assetId === exchangeToken.tokenId
	);
	const receiveAsset = exchangeAssets?.find(
		(token) => token.assetId === receiveToken.tokenId
	);

	const [slippage, setSlippage] = useState<string>("5");

	const [txStatus, setTxStatus] = useState<TxStatus>(null);

	return (
		<SwapContext.Provider
			value={{
				exchangeAssets,
				receiveAssets,
				setReceiveAssets,
				exchangeToken,
				exchangeValue,
				receiveToken,
				receiveValue,
				exchangeAsset,
				receiveAsset,
				cpayAsset,
				slippage,
				setSlippage,
				txStatus,
				setTxStatus,
			}}
		>
			{children}
		</SwapContext.Provider>
	);
};

export default SwapProvider;

export const useSwap = (): SwapContextType => useContext(SwapContext);
