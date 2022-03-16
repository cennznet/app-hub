import { CENNZAsset, PoolAction } from "@/types";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useState,
} from "react";
import {
	useTokenInput,
	TokenInputHook,
	usePoolExchangeRate,
	PoolExchangeRateHook,
	usePoolBalances,
	PoolBalancesHook,
} from "@/hooks";
import { CENNZ_ASSET_ID, CPAY_ASSET_ID } from "@/constants";

type CENNZAssetId = CENNZAsset["assetId"];

interface PoolContextType extends PoolExchangeRateHook, PoolBalancesHook {
	poolAction: PoolAction;
	setPoolAction: Dispatch<SetStateAction<PoolAction>>;
	tradeAssets: CENNZAsset[];
	tradeAsset: CENNZAsset;
	tradeToken: TokenInputHook<CENNZAssetId>[0];
	tradeValue: TokenInputHook<CENNZAssetId>[1];
	coreAsset: CENNZAsset;
	coreToken: TokenInputHook<CENNZAssetId>[0];
	coreValue: TokenInputHook<CENNZAssetId>[1];
	slippage: string;
	setSlippage: Dispatch<SetStateAction<string>>;
}

const PoolContext = createContext<PoolContextType>({} as PoolContextType);

interface PoolProviderProps {
	supportedAssets: CENNZAsset[];
}

const PoolProvider: FC<PoolProviderProps> = ({ supportedAssets, children }) => {
	const [tradeAssets] = useState<CENNZAsset[]>(
		supportedAssets.filter((asset) => asset.assetId !== CPAY_ASSET_ID)
	);
	const [poolAction, setPoolAction] = useState<PoolAction>("Add");

	const cennzAsset = supportedAssets?.find(
		(asset) => asset.assetId === CENNZ_ASSET_ID
	);
	const coreAsset = supportedAssets?.find(
		(asset) => asset.assetId === CPAY_ASSET_ID
	);

	const [tradeToken, tradeValue] = useTokenInput(cennzAsset.assetId);
	const [coreToken, coreValue] = useTokenInput(coreAsset.assetId);

	const tradeAsset = tradeAssets?.find(
		(asset) => asset.assetId === tradeToken.tokenId
	);

	const {
		exchangeRate,
		exchangeInfo,
		updatingExchangeRate,
		updateExchangeRate,
	} = usePoolExchangeRate(tradeAsset, coreAsset);

	const {
		tradePoolBalance,
		corePoolBalance,
		updatingPoolBalances,
		updatePoolBalances,
	} = usePoolBalances(tradeAsset, coreAsset);

	const [slippage, setSlippage] = useState<string>("5");

	return (
		<PoolContext.Provider
			value={{
				poolAction,
				setPoolAction,
				tradeAssets,
				coreAsset,
				tradeAsset,
				tradeToken,
				tradeValue,
				coreToken,
				coreValue,

				exchangeRate,
				exchangeInfo,
				updateExchangeRate,
				updatingExchangeRate,

				tradePoolBalance,
				corePoolBalance,
				updatingPoolBalances,
				updatePoolBalances,

				slippage,
				setSlippage,
			}}
		>
			{children}
		</PoolContext.Provider>
	);
};

export default PoolProvider;

export const usePool = (): PoolContextType => {
	return useContext(PoolContext);
};
