import { FeeRate } from "@cennznet/types";
import { Amount, AmountUnit } from "../utils/Amount";
import { AssetInfo } from "./SupportedAssetsProvider";
import {
	AmountParams,
	Asset,
	IExchangePool,
	IFee,
	IOption,
	IUserShareInPool,
	LiquidityFormData,
} from "../types/exchange";
import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useCENNZApi } from "./CENNZApiProvider";

export enum PoolAction {
	ADD = "Add",
	REMOVE = "Withdraw",
}

export type PoolContextType = {
	coreAsset: AssetInfo;
	exchangeRateMsg?: string;
	txFeeMsg: string;
	fee: any;
	feeRate: FeeRate;
	exchangePool: IExchangePool;
	updateExchangePool: Function;
};

const poolContextDefaultValues = {
	coreAsset: null,
	exchangeRateMsg: null,
	txFeeMsg: null,
	fee: null,
	feeRate: null,
	poolShare: null,
	getPoolShare: null,
	exchangePool: null,
	updateExchangePool: null,
};

const PoolContext = createContext<PoolContextType>(poolContextDefaultValues);

type ProviderProps = {};

export default function PoolProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	const [value, setValue] = useState<PoolContextType>(poolContextDefaultValues);
	const { api } = useCENNZApi();

	const updateExchangePool = useCallback(
		async (asset) => {
			if (!api) return;
			const exchangeAddress = await api.derive.cennzx.exchangeAddress(asset.id);

			const assetBalance = await api.derive.cennzx.poolAssetBalance(asset.id);

			const coreAssetId = await api.query.cennzx.coreAssetId();
			const coreAssetBalance = await api.derive.cennzx.poolCoreAssetBalance(
				Number(coreAssetId)
			);

			setValue({
				...value,
				exchangePool: {
					address: exchangeAddress.toString(),
					assetId: asset.id,
					assetBalance: new Amount(assetBalance),
					coreAssetBalance: new Amount(coreAssetBalance),
				},
			});
		},
		[api]
	);

	// const getPoolAssetLiquidity = useCallback(async (assetId) => {
	// 	if (!api) return;
	// 	const assetLiquidity = await api.derive.cennzx.totalLiquidity(assetId);
	// 	console.log("assetLiquidity", assetLiquidity.toNumber());
	// }, []);

	// const getPoolCoreLiquidity = useCallback(async () => {
	// 	if (!api) return;
	// 	const coreAssetId = await api.query.cennzx.coreAssetId();

	// 	const coreLiquidity = await api.derive.cennzx.totalLiquidity(
	// 		Number(coreAssetId)
	// 	);
	// 	console.log("coreLiquidity", coreLiquidity.toNumber());
	// }, []);

	// const getPoolShare = useCallback(
	// 	async (assetId, address, tokenAmount) => {
	// 		if (!api) return;

	// 		const userLiquidity = await api.derive.cennzx.liquidityBalance(
	// 			assetId,
	// 			address
	// 		);
	// 		const totalLiquidity = await api.derive.cennzx.totalLiquidity(assetId);

	// 		const poolShare = new Amount(tokenAmount)
	// 			.mul(userLiquidity)
	// 			.div(totalLiquidity);

	// 		setValue({ ...value, poolShare: poolShare.toNumber() });
	// 	},
	// 	[api, value]
	// );

	//Populate values
	useEffect(() => {
		if (!api) return;

		// getPoolAssetLiquidity(16000);
		// getPoolCoreLiquidity();
	}, [api]);

	return (
		<PoolContext.Provider value={{ ...value, updateExchangePool }}>
			{children}
		</PoolContext.Provider>
	);
}

export function usePool(): PoolContextType {
	return useContext(PoolContext);
}
