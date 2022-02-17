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
import {
	fetchAddLiquidityValues,
	fetchExchangePool,
	fetchFeeEstimate,
	fetchUserPoolShare,
	fetchWithdrawLiquidityValues,
} from "../utils/pool";

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

			const exchangePool: IExchangePool = await fetchExchangePool(
				api,
				asset.id
			);

			setValue((value) => ({
				...value,
				exchangePool,
			}));
		},
		[api]
	);

	const getUserPoolShare = useCallback(
		async (asset) => {
			if (!api || !selectedAccount || !value.coreAsset) return;

			const userPoolShare: IUserShareInPool = await fetchUserPoolShare(
				api,
				selectedAccount.address,
				asset.id
			);

			setValue({ ...value, userPoolShare });
		},
		[api, selectedAccount, value]
	);

	const defineExtrinsic = useCallback(
		async (
			asset: AssetInfo,
			assetAmount: Amount,
			coreAmount: Amount,
			poolAction: string,
			withdrawMax: boolean,
			buffer
		) => {
			if (!api || !signer || !selectedAccount || !value.exchangePool) return;

			let extrinsic;
			if (poolAction === PoolAction.ADD) {
				const { minLiquidity, maxAssetAmount, maxCoreAmount } =
					await fetchAddLiquidityValues(
						api,
						asset,
						assetAmount,
						value.coreAsset,
						coreAmount,
						value.exchangePool,
						buffer
					);

				extrinsic = api.tx.cennzx.addLiquidity(
					asset.id,
					minLiquidity,
					maxAssetAmount,
					maxCoreAmount
				);
			} else {
				const { liquidityAmount, minAssetWithdraw, minCoreWithdraw } =
					await fetchWithdrawLiquidityValues(
						api,
						asset,
						selectedAccount.address,
						assetAmount,
						value.coreAsset,
						coreAmount,
						value.exchangePool,
						withdrawMax,
						buffer
					);

				extrinsic = api.tx.cennzx.removeLiquidity(
					asset.id,
					liquidityAmount,
					minAssetWithdraw,
					minCoreWithdraw
				);
			}

			const estimatedFee = await fetchFeeEstimate(
				api,
				extrinsic,
				value.coreAsset.id,
				"50000000000000000"
			);

			setValue({
				...value,
				estimatedFee,
				currentExtrinsic: extrinsic,
			});
		},
		[api, selectedAccount, value, signer]
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
