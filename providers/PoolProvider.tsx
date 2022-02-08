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
import { SubmittableExtrinsic } from "@cennznet/api/types";

export enum PoolAction {
	ADD = "Add",
	REMOVE = "Withdraw",
}

export type PoolContextType = {
	coreAsset: AssetInfo;
	estimatedFee: Amount;
	userPoolShare: IUserShareInPool;
	getUserPoolShare: Function;
	exchangePool: IExchangePool;
	updateExchangePool: Function;
	currentExtrinsic: any;
	defineExtrinsic: Function;
	sendExtrinsic: Function;
};

const poolContextDefaultValues = {
	coreAsset: null,
	estimatedFee: null,
	userPoolShare: null,
	getUserPoolShare: null,
	exchangePool: null,
	updateExchangePool: null,
	currentExtrinsic: null,
	defineExtrinsic: null,
	sendExtrinsic: null,
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

	//set core asset
	useEffect(() => {
		(async () => {
			if (!api) return;
			const coreAssetId = await api.query.cennzx.coreAssetId();
			let coreAsset: any = await api.query.genericAsset.assetMeta(
				Number(coreAssetId)
			);

			setValue((value) => ({
				...value,
				coreAsset: { ...coreAsset.toHuman(), id: Number(coreAssetId) },
			}));
		})();
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

	const setEstimatedFee = useCallback(
		async (extrinsic) => {
			const feeEstimate: any = await api.derive.fees.estimateFee({
				extrinsic,
				userFeeAssetId: value.coreAsset.id,
				maxPayment: "50000000000000000",
			});

			setValue({
				...value,
				estimatedFee: new Amount(feeEstimate),
				currentExtrinsic: extrinsic,
			});
		},
		[api, value]
	);

	const defineExtrinsic = useCallback(
		async (
			asset: AssetInfo,
			assetAmount: Amount,
			coreAmount: Amount,
			poolAction,
			buffer = 0.05
		) => {
			if (!api || !signer || !selectedAccount || !value.exchangePool) return;
			let extrinsic;
			if (poolAction === PoolAction.ADD) {
				const totalLiquidity = await api.derive.cennzx.totalLiquidity(asset.id);

				const assetAmountCal = new Amount(
					assetAmount,
					AmountUnit.DISPLAY,
					asset.decimals
				);
				const coreAmountCal = new Amount(
					coreAmount,
					AmountUnit.DISPLAY,
					value.coreAsset.decimals
				);

				const minLiquidity = totalLiquidity.isZero()
					? coreAmount
					: new Amount(coreAmountCal).mul(
							totalLiquidity.div(value.exchangePool.coreAssetBalance)
					  );

				const maxAssetAmount = totalLiquidity.isZero()
					? assetAmount
					: new Amount(assetAmountCal.muln(1 + buffer));

				extrinsic = api.tx.cennzx.addLiquidity(
					asset.id,
					minLiquidity,
					maxAssetAmount,
					coreAmountCal
				);
			}

			setEstimatedFee(extrinsic);
		},
		[api, selectedAccount, value, signer, setEstimatedFee]
	);

	const sendExtrinsic = useCallback(async () => {
		if (!api || !value.currentExtrinsic) return;
		value.currentExtrinsic.signAndSend(
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
	}, [api, value]);

	return (
		<PoolContext.Provider
			value={{
				...value,
				updateExchangePool,
				defineExtrinsic,
				getUserPoolShare,
				sendExtrinsic,
			}}
		>
			{children}
		</PoolContext.Provider>
	);
}

export function usePool(): PoolContextType {
	return useContext(PoolContext);
}
