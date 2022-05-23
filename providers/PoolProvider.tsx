import { CENNZAsset, PoolAction } from "@/types";
import {
	createContext,
	memo,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useState,
	useEffect,
	PropsWithChildren,
} from "react";
import {
	useTokenInput,
	usePoolExchangeInfo,
	usePoolUserInfo,
	useTxStatus,
	TokenInputHook,
	PoolExchangeInfoHook,
	PoolUserInfoHook,
	TxStatusHook,
} from "@/hooks";
import { CENNZ_ASSET_ID, CPAY_ASSET_ID } from "@/constants";

type CENNZAssetId = CENNZAsset["assetId"];

interface PoolContextType
	extends PoolExchangeInfoHook,
		PoolUserInfoHook,
		TxStatusHook {
	poolAction: PoolAction;
	setPoolAction: Dispatch<SetStateAction<PoolAction>>;
	tradeAssets: CENNZAsset[];
	tradeAsset: CENNZAsset;

	tradeSelect: TokenInputHook<CENNZAssetId>[0];
	tradeInput: TokenInputHook<CENNZAssetId>[1];

	coreAsset: CENNZAsset;

	coreSelect: TokenInputHook<CENNZAssetId>[0];
	coreInput: TokenInputHook<CENNZAssetId>[1];

	slippage: string;
	setSlippage: Dispatch<SetStateAction<string>>;
}

const PoolContext = createContext<PoolContextType>({} as PoolContextType);

interface PoolProviderProps {
	supportedAssets: CENNZAsset[];
}

const PoolProvider: FC<PropsWithChildren<PoolProviderProps>> = ({
	supportedAssets,
	children,
}) => {
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

	const [tradeSelect, tradeInput] = useTokenInput(cennzAsset.assetId);
	const [coreSelect, coreInput] = useTokenInput(coreAsset.assetId);

	const tradeAsset = tradeAssets?.find(
		(asset) => asset.assetId === tradeSelect.tokenId
	);

	const { exchangeInfo, updatingExchangeInfo, updateExchangeRate } =
		usePoolExchangeInfo(tradeAsset, coreAsset);

	const { userInfo, updatingPoolUserInfo, updatePoolUserInfo } =
		usePoolUserInfo(tradeAsset, coreAsset);

	useEffect(() => {
		if (poolAction !== "Remove") return;
		updatePoolUserInfo();
	}, [poolAction, updatePoolUserInfo]);

	const [slippage, setSlippage] = useState<string>("5");

	return (
		<PoolContext.Provider
			value={{
				poolAction,
				setPoolAction,
				tradeAssets,
				coreAsset,
				tradeAsset,
				tradeSelect,
				tradeInput,
				coreSelect,
				coreInput,

				exchangeInfo,
				updateExchangeRate,
				updatingExchangeInfo,

				userInfo,
				updatingPoolUserInfo,
				updatePoolUserInfo,

				slippage,
				setSlippage,

				...useTxStatus(),
			}}
		>
			{children}
		</PoolContext.Provider>
	);
};

export default memo(PoolProvider);

export const usePool = (): PoolContextType => {
	return useContext(PoolContext);
};
