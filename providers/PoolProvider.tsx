import { CENNZAsset, PoolAction } from "@/types";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useState,
} from "react";
import { useTokenInput, TokenInputHookType } from "@/hooks";
import { CENNZ_ASSET_ID, CPAY_ASSET_ID } from "@/constants";

type CENNZAssetId = CENNZAsset["assetId"];

interface PoolContextType {
	poolAction: PoolAction;
	setPoolAction: Dispatch<SetStateAction<PoolAction>>;
	tradeAssets: CENNZAsset[];
	tradeAsset: CENNZAsset;
	tradeToken: TokenInputHookType<CENNZAssetId>[0];
	tradeValue: TokenInputHookType<CENNZAssetId>[1];
	coreAsset: CENNZAsset;
	coreToken: TokenInputHookType<CENNZAssetId>[0];
	coreValue: TokenInputHookType<CENNZAssetId>[1];
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
