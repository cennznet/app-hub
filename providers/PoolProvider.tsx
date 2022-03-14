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
	poolAssets: CENNZAsset[];
	cpayAsset: CENNZAsset;
	poolAsset: CENNZAsset;
	poolToken: TokenInputHookType<CENNZAssetId>[0];
	poolValue: TokenInputHookType<CENNZAssetId>[1];
	cpayToken: TokenInputHookType<CENNZAssetId>[0];
	cpayValue: TokenInputHookType<CENNZAssetId>[1];
}

const PoolContext = createContext<PoolContextType>({} as PoolContextType);

interface PoolProviderProps {
	supportedAssets: CENNZAsset[];
}

const PoolProvider: FC<PoolProviderProps> = ({ supportedAssets, children }) => {
	const [poolAssets] = useState<CENNZAsset[]>(
		supportedAssets.filter((asset) => asset.assetId !== CPAY_ASSET_ID)
	);
	const [poolAction, setPoolAction] = useState<PoolAction>("Add");

	const cennzAsset = supportedAssets?.find(
		(asset) => asset.assetId === CENNZ_ASSET_ID
	);
	const cpayAsset = supportedAssets?.find(
		(asset) => asset.assetId === CPAY_ASSET_ID
	);

	const [poolToken, poolValue] = useTokenInput(cennzAsset.assetId);
	const [cpayToken, cpayValue] = useTokenInput(cpayAsset.assetId);

	const poolAsset = poolAssets?.find(
		(asset) => asset.assetId === poolToken.tokenId
	);

	return (
		<PoolContext.Provider
			value={{
				poolAction,
				setPoolAction,
				poolAssets,
				cpayAsset,
				poolAsset,
				poolToken,
				poolValue,
				cpayToken,
				cpayValue,
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
