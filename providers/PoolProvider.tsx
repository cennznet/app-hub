import { Api } from "@cennznet/api";
import { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import { CENNZAsset, IExchangePool, IUserShareInPool } from "@/types";
import {
	FC,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import {
	fetchAddLiquidityValues,
	fetchExchangePool,
	fetchFeeEstimate,
	fetchUserPoolShare,
	fetchWithdrawLiquidityValues,
} from "@/utils/pool";
import { useGlobalModal } from "@/providers/GlobalModalProvider";
import Big from "big.js";

export enum PoolAction {
	ADD = "Add",
	REMOVE = "Withdraw",
}

type PoolContextType = {
	coreAsset: CENNZAsset;
	estimatedFee: Big;
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

const PoolProvider: FC<{
	api: Api;
	selectedAccount: InjectedAccountWithMeta;
}> = ({ children, api, selectedAccount }) => {
	const [value, setValue] = useState<PoolContextType>(poolContextDefaultValues);
	const { wallet, updateBalances } = useCENNZWallet();
	const { showDialog } = useGlobalModal();
	const signer = wallet?.signer;

	//set core asset
	useEffect(() => {
		(async () => {
			if (!api) return;
			const coreAssetId = await api.query.cennzx.coreAssetId();
			let coreAsset: any = await api.query.genericAsset.assetMeta(
				Number(coreAssetId)
			);
			coreAsset = coreAsset.toHuman();

			setValue((value) => ({
				...value,
				coreAsset: {
					symbol: coreAsset.symbol,
					assetId: Number(coreAssetId),
					decimals: Number(coreAsset.decimalPlaces),
				},
			}));
		})();
	}, [api]);

	const updateExchangePool = useCallback(
		async (asset) => {
			if (!api) return;

			const exchangePool: IExchangePool = await fetchExchangePool(
				api,
				asset.assetId
			);

			setValue((value) => ({
				...value,
				exchangePool: {
					...exchangePool,
					assetBalance: exchangePool.assetBalance.div(10 ** asset.decimals),
					coreAssetBalance: exchangePool.coreAssetBalance.div(10 ** value.coreAsset.decimals)
				},
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
				asset.assetId
			);

			setValue({ ...value, userPoolShare });
		},
		[api, selectedAccount, value]
	);

	const defineExtrinsic = useCallback(
		async (
			asset: CENNZAsset,
			assetAmount: Big,
			coreAmount: Big,
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
					asset.assetId,
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
					asset.assetId,
					liquidityAmount,
					minAssetWithdraw,
					minCoreWithdraw
				);
			}

			const estimatedFee: Big = Big(
				await fetchFeeEstimate(
					api,
					extrinsic,
					value.coreAsset.assetId,
					"50000000000000000"
				)
			);

			setValue({
				...value,
				estimatedFee: estimatedFee.div(Big(10 ** value.coreAsset.decimals)),
				currentExtrinsic: extrinsic,
			});
		},
		[api, selectedAccount, value, signer]
	);

	const sendExtrinsic = useCallback(async () => {
		if (!api || !value.currentExtrinsic || !selectedAccount || !signer) return;
		await showDialog({
			title: "Pool Transaction in Progress",
			message: "Please sign transaction to continue.",
			loading: true,
		});
		value.currentExtrinsic.signAndSend(
			selectedAccount.address,
			{ signer },
			async ({ status, events }: any) => {
				if (status.isInBlock) {
					let foundMethodType = "";
					for (const {
						event: { method, section, data },
					} of events) {
						if (method === "AddLiquidity" || method === "RemoveLiquidity")
							foundMethodType = method;
						console.log({ method, section, data: data.toHuman() });
						if (method === "ExtrinsicSuccess") {
							const msg =
								foundMethodType === "AddLiquidity"
									? "Liquidity Successfully added to the pool!"
									: "Liquidity Successfully withdrawn from the pool!";
							await showDialog({
								title: "Transaction Successfully Completed!",
								message: msg,
							});
							await updateBalances();
						}
					}
				}
			}
		);
	}, [api, value, selectedAccount, signer, updateBalances, showDialog]);

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
};

export default PoolProvider;

export function usePool(): PoolContextType {
	return useContext(PoolContext);
}
