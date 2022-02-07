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
	useMemo,
} from "react";
import { useCENNZApi } from "./CENNZApiProvider";
import { useWallet } from "./SupportedWalletProvider";

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
	userPoolShare: IUserShareInPool;
	getUserPoolShare: Function;
	exchangePool: IExchangePool;
	updateExchangePool: Function;
	addLiquidity: Function;
};

const poolContextDefaultValues = {
	coreAsset: null,
	exchangeRateMsg: null,
	txFeeMsg: null,
	fee: null,
	feeRate: null,
	userPoolShare: null,
	getUserPoolShare: null,
	exchangePool: null,
	updateExchangePool: null,
	addLiquidity: null,
};

const PoolContext = createContext<PoolContextType>(poolContextDefaultValues);

type ProviderProps = {};

export default function PoolProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	const [value, setValue] = useState<PoolContextType>(poolContextDefaultValues);
	const { api } = useCENNZApi();
	const { wallet, selectedAccount } = useWallet();
	const signer = useMemo(() => wallet?.signer, [wallet]);

	const setCoreAsset = useCallback(async () => {
		if (!api) return;
		const coreAssetId = await api.query.cennzx.coreAssetId();
		let coreAsset: any = await api.query.genericAsset.assetMeta(
			Number(coreAssetId)
		);

		setValue((value) => ({
			...value,
			coreAsset: { ...coreAsset.toHuman(), id: Number(coreAssetId) },
		}));
	}, [api]);

	const updateExchangePool = useCallback(
		async (asset) => {
			if (!api) return;
			const exchangeAddress = await api.derive.cennzx.exchangeAddress(asset.id);

			const assetBalance = await api.derive.cennzx.poolAssetBalance(asset.id);

			const coreAssetBalance = await api.derive.cennzx.poolCoreAssetBalance(
				asset.id
			);

			setValue((value) => ({
				...value,
				exchangePool: {
					address: exchangeAddress.toString(),
					assetId: asset.id,
					assetBalance: new Amount(assetBalance),
					coreAssetBalance: new Amount(coreAssetBalance),
				},
			}));
		},
		[api]
	);

	useEffect(() => {
		setCoreAsset();
	}, [setCoreAsset]);

	/// Extrinsics
	// api.tx.cennzx.addLiquidity(assetId, minimumLiqudityToBuy, maximumAssetToPlace, coreAssetToPlace);
	// api.tx.cennzx.removeLiquidity(assetId, liquidityToWithdraw, minimumAssetToWithdraw, minimumCoreAssetToWithdraw);

	// /// RPC Calls
	// api.rpc.cennzx.liquidityValue(account, exchangeAsset);
	// api.rpc.cennzx.liquidityPrice(exchangeAsset, liquidityAmount);

	const addLiquidity = useCallback(
		async (
			asset: AssetInfo,
			assetAmount: Amount,
			coreAmount,
			buffer = 0.05
		) => {
			if (!api || !signer || !selectedAccount || !value.exchangePool) return;

			const totalLiquidity = await api.derive.cennzx.totalLiquidity(asset.id);

			const min_liquidity = new Amount(coreAmount).mul(
				totalLiquidity.div(value.exchangePool.coreAssetBalance)
			);
			const max_asset_amount = new Amount(assetAmount.muln(1 + buffer));

			let extrinsic = api.tx.cennzx.addLiquidity(
				asset.id,
				min_liquidity,
				max_asset_amount,
				coreAmount
			);

			console.log("extrinsic", extrinsic);

			const feeEstimate = await api.derive.fees.estimateFee({
				extrinsic,
				userFeeAssetId: asset.id,
				maxPayment: "50000000000000000",
			});

			console.log("feeEstimate", feeEstimate.toString());

			extrinsic.signAndSend(
				selectedAccount.address,
				{ signer },
				async ({ status, events }: any) => {
					if (status.isInBlock) {
						for (const {
							event: { method, section, data },
						} of events) {
							console.log({ method, section, data: data.toHuman() });
						}
					}
				}
			);
		},
		[api, selectedAccount, value, signer]
	);

	const getUserPoolShare = useCallback(
		async (asset) => {
			if (!api || !selectedAccount || !value.coreAsset) return;

			const liquidityValue = await (api.rpc as any).cennzx.liquidityValue(
				selectedAccount.address,
				asset.id
			);
			const liquidity: Amount = new Amount(liquidityValue.liquidity);
			const userAssetShare: Amount = new Amount(liquidityValue.asset);
			const userCoreShare: Amount = new Amount(liquidityValue.core);
			const userShare: IUserShareInPool = {
				coreAssetBalance: userCoreShare,
				assetBalance: userAssetShare,
				address: selectedAccount.address,
				liquidity: liquidity,
				assetId: asset.id,
			};
			setValue({ ...value, userPoolShare: userShare });
		},
		[api, selectedAccount, value]
	);

	return (
		<PoolContext.Provider
			value={{ ...value, updateExchangePool, addLiquidity, getUserPoolShare }}
		>
			{children}
		</PoolContext.Provider>
	);
}

export function usePool(): PoolContextType {
	return useContext(PoolContext);
}
