import type { CENNZAsset, PropsWithChildren } from "@/libs/types";

import {
	createContext,
	useContext,
	useState,
	SetStateAction,
	Dispatch,
	FC,
} from "react";
import { fetchSwapAssets } from "@/libs/utils";
import { CENNZ_ASSET_ID, CPAY_ASSET_ID } from "@/libs/constants";
import {
	useTokenInput,
	useTokensFetcher,
	useTxStatus,
	TokenInputHook,
	TxStatusHook,
} from "@/libs/hooks";

type CENNZAssetId = CENNZAsset["assetId"];

interface SwapContextType extends TxStatusHook {
	exchangeAssets: CENNZAsset[];
	receiveAssets: CENNZAsset[];
	cpayAsset: CENNZAsset;
	setReceiveAssets: Dispatch<SetStateAction<CENNZAsset[]>>;
	exchangeSelect: TokenInputHook<CENNZAssetId>[0];
	exchangeInput: TokenInputHook<CENNZAssetId>[1];
	receiveSelect: TokenInputHook<CENNZAssetId>[0];
	receiveInput: TokenInputHook<CENNZAssetId>[1];
	exchangeAsset: CENNZAsset;
	receiveAsset: CENNZAsset;
	slippage: string;
	setSlippage: Dispatch<SetStateAction<string>>;
}

const SwapContext = createContext<SwapContextType>({} as SwapContextType);

interface SwapProviderProps extends PropsWithChildren {
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
		(asset) => asset.assetId === CENNZ_ASSET_ID
	);
	const cpayAsset = exchangeAssets?.find(
		(asset) => asset.assetId === CPAY_ASSET_ID
	);

	const [exchangeSelect, exchangeInput] = useTokenInput(cennzAsset.assetId);
	const [receiveSelect, receiveInput] = useTokenInput(cpayAsset.assetId);

	const exchangeAsset = exchangeAssets?.find(
		(asset) => asset.assetId === exchangeSelect.tokenId
	);
	const receiveAsset = exchangeAssets?.find(
		(asset) => asset.assetId === receiveSelect.tokenId
	);

	const [slippage, setSlippage] = useState<string>("5");

	return (
		<SwapContext.Provider
			value={{
				exchangeAssets,
				receiveAssets,
				setReceiveAssets,
				exchangeSelect,
				exchangeInput,
				receiveSelect,
				receiveInput,
				exchangeAsset,
				receiveAsset,
				cpayAsset,
				slippage,
				setSlippage,

				...useTxStatus(),
			}}
		>
			{children}
		</SwapContext.Provider>
	);
};

export default SwapProvider;

export const useSwap = (): SwapContextType => useContext(SwapContext);
