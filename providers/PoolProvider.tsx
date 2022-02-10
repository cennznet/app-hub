import { Amount, AmountUnit } from "../utils/Amount";
import { AssetInfo } from "../types";
import {
	AmountParams,
	Asset,
	IExchangePool,
	IFee,
	IOption,
	IUserShareInPool,
	LiquidityFormData,
} from "../types";
import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useCENNZApi } from "./CENNZApiProvider";
import { useWallet } from "./SupportedWalletProvider";

export enum PoolAction {
	ADD = "Add",
	REMOVE = "Withdraw",
}

type PoolContextType = {
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
	const { wallet, selectedAccount, fetchAssetBalances } = useWallet();
	const signer = wallet?.signer;

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
			if (!api || !value.coreAsset) return;

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
			poolAction: string,
			withdrawMax: boolean,
			buffer = 0.05
		) => {
			if (!api || !signer || !selectedAccount || !value.exchangePool) return;
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

			let extrinsic;
			if (poolAction === PoolAction.ADD) {
				const minLiquidity = totalLiquidity.isZero()
					? coreAmountCal
					: new Amount(coreAmountCal).mul(
							totalLiquidity.div(value.exchangePool.coreAssetBalance)
					  );

				const maxAssetAmount = totalLiquidity.isZero()
					? assetAmountCal
					: new Amount(assetAmountCal.muln(1 + buffer));

				extrinsic = api.tx.cennzx.addLiquidity(
					asset.id,
					minLiquidity,
					maxAssetAmount,
					coreAmountCal
				);
			} else {
				let liquidityAmount, assetToWithdraw;
				if (withdrawMax) {
					liquidityAmount = await api.derive.cennzx.liquidityBalance(
						asset.id,
						selectedAccount.address
					);
					assetToWithdraw = await api.derive.cennzx.assetToWithdraw(
						asset.id,
						liquidityAmount
					);
				} else if (
					value.exchangePool.assetBalance ===
					value.exchangePool.coreAssetBalance
				) {
					liquidityAmount = assetAmountCal
						.mul(totalLiquidity)
						.div(value.exchangePool.assetBalance);
				} else {
					liquidityAmount = assetAmountCal
						.mul(totalLiquidity)
						.div(value.exchangePool.assetBalance)
						.addn(1);
				}

				const coreWithdrawAmount = liquidityAmount
					.mul(value.exchangePool.coreAssetBalance)
					.div(totalLiquidity);

				const minCoreWithdraw = withdrawMax
					? assetToWithdraw.coreAmount
					: new Amount(coreWithdrawAmount.muln(1 - buffer));
				const minAssetWithdraw = withdrawMax
					? assetToWithdraw.assetAmount
					: new Amount(assetAmountCal.muln(1 - buffer));

				extrinsic = api.tx.cennzx.removeLiquidity(
					asset.id,
					liquidityAmount,
					minAssetWithdraw,
					minCoreWithdraw
				);
			}

			setEstimatedFee(extrinsic);
		},
		[api, selectedAccount, value, signer, setEstimatedFee]
	);

	const sendExtrinsic = useCallback(async () => {
		if (!api || !value.currentExtrinsic || !selectedAccount || !signer) return;
		value.currentExtrinsic.signAndSend(
			selectedAccount.address,
			{ signer },
			async ({ status, events }: any) => {
				if (status.isInBlock) {
					for (const {
						event: { method, section, data },
					} of events) {
						//TODO - format response for user
						console.log({ method, section, data: data.toHuman() });
						if (method === "ExtrinsicSuccess") fetchAssetBalances();
					}
				}
			}
		);
	}, [api, value, selectedAccount, signer, fetchAssetBalances]);

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
