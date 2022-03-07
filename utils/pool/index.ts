import { Api } from "@cennznet/api";
import {
	CENNZAsset,
	IExchangePool,
	IUserShareInPool,
	PoolValues,
} from "@/types";
import { formatBalance } from "@/utils";
import Big from "big.js";

export const fetchCoreAmount = (
	tradeAmount: Big,
	exchangePool: IExchangePool
) => {
	const coreAmount: Big = tradeAmount
		.times(exchangePool.coreAssetBalance)
		.div(exchangePool.assetBalance);

	return coreAmount;
};

export const fetchTradeAmount = (
	coreAmount: Big,
	exchangePool: IExchangePool
) => {
	const tradeAmount: Big = coreAmount
		.times(exchangePool.assetBalance)
		.div(exchangePool.coreAssetBalance);

	return tradeAmount;
};

export const fetchExchangeRate = (
	exchangePool: IExchangePool,
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
) => {
	const exchangeRate: Big = exchangePool.assetBalance
		.div(10 ** tradeAsset.decimals)
		.div(exchangePool.coreAssetBalance.div(10 ** coreAsset.decimals));

	return formatBalance(exchangeRate.toNumber());
};

export const checkLiquidityBalances = (
	poolAction: string,
	coreAmount: number,
	tradeAmount: number,
	userBalances: PoolValues
) => {
	if (poolAction === "Add") {
		if (
			coreAmount > userBalances.coreAsset &&
			tradeAmount > userBalances.tradeAsset
		)
			return "coreAndTrade";
		else if (coreAmount > userBalances.coreAsset) return "core";
		else if (tradeAmount > userBalances.tradeAsset) return "trade";
	} else {
		if (
			coreAmount > userBalances.coreLiquidity &&
			tradeAmount > userBalances.tradeLiquidity
		)
			return "coreAndTrade";
		else if (coreAmount > userBalances.coreLiquidity) return "core";
		else if (tradeAmount > userBalances.tradeLiquidity) return "trade";
	}
};

export const fetchExchangePool = async (
	api: Api,
	assetId: number
): Promise<IExchangePool> => {
	const address = await api.derive.cennzx.exchangeAddress(assetId);

	const assetBalance: Big = Big(
		await api.derive.cennzx.poolAssetBalance(assetId)
	);

	const coreAssetBalance: Big = Big(
		await api.derive.cennzx.poolCoreAssetBalance(assetId)
	);

	return {
		address,
		assetBalance,
		coreAssetBalance,
		assetId,
	};
};

export const fetchUserPoolShare = async (
	api: Api,
	address: string,
	assetId: number
): Promise<IUserShareInPool> => {
	const liquidityValue = await (api.rpc as any).cennzx.liquidityValue(
		address,
		assetId
	);
	const liquidity: Big = Big(liquidityValue.liquidity);
	const userAssetShare: Big = Big(liquidityValue.asset);
	const userCoreShare: Big = Big(liquidityValue.core);
	return {
		coreAssetBalance: userCoreShare,
		assetBalance: userAssetShare,
		address: address,
		liquidity: liquidity,
		assetId: assetId,
	};
};

export const calculateValues = async (
	api: Api,
	asset: CENNZAsset,
	assetAmount: Big,
	coreAsset: CENNZAsset,
	coreAmount: Big
) => {
	const totalLiquidity: Big = Big(
		await api.derive.cennzx.totalLiquidity(asset.assetId)
	);
	const assetAmountCal: Big = Big(assetAmount).times(10 ** asset.decimals);
	const coreAmountCal: Big = Big(coreAmount).times(10 ** coreAsset.decimals);

	return { totalLiquidity, assetAmountCal, coreAmountCal };
};

export const fetchAddLiquidityValues = async (
	api: Api,
	asset: CENNZAsset,
	assetAmount: Big,
	coreAsset: CENNZAsset,
	coreAmount: Big,
	exchangePool: IExchangePool,
	buffer: number
) => {
	const { totalLiquidity, assetAmountCal, coreAmountCal } =
		await calculateValues(api, asset, assetAmount, coreAsset, coreAmount);

	const minLiquidity: Big = totalLiquidity.eq(0)
		? coreAmountCal
		: coreAmountCal
				.times(totalLiquidity)
				.div(exchangePool.coreAssetBalance.times(10 ** coreAsset.decimals))
				.toFixed(0);

	const maxAssetAmount: Big = totalLiquidity.eq(0)
		? assetAmountCal
		: assetAmountCal.times(1 + buffer).toFixed(0);

	return {
		minLiquidity,
		maxAssetAmount,
		maxCoreAmount: coreAmountCal.toFixed(0),
	};
};

export const fetchWithdrawLiquidityValues = async (
	api: Api,
	asset: CENNZAsset,
	address: string,
	assetAmount: Big,
	coreAsset: CENNZAsset,
	coreAmount: Big,
	exchangePool: IExchangePool,
	withdrawMax: boolean,
	buffer?: number
) => {
	const { totalLiquidity, assetAmountCal } = await calculateValues(
		api,
		asset,
		assetAmount,
		coreAsset,
		coreAmount
	);

	let liquidityAmount: Big, assetToWithdraw;
	if (withdrawMax) {
		liquidityAmount = Big(
			await api.derive.cennzx.liquidityBalance(asset.assetId, address)
		);
		assetToWithdraw = await api.derive.cennzx.assetToWithdraw(
			asset.assetId,
			liquidityAmount
		);
	} else if (exchangePool.assetBalance === exchangePool.coreAssetBalance) {
		liquidityAmount = assetAmountCal
			.times(totalLiquidity)
			.div(exchangePool.assetBalance);
	} else {
		liquidityAmount = assetAmountCal
			.times(totalLiquidity)
			.div(exchangePool.assetBalance)
			.add(1);
	}

	const coreWithdrawAmount: Big = liquidityAmount
		.times(exchangePool.coreAssetBalance)
		.div(totalLiquidity);

	const minCoreWithdraw: Big = withdrawMax
		? Big(assetToWithdraw.coreAmount)
		: Big(coreWithdrawAmount.timesn(Big(1 - buffer)));
	const minAssetWithdraw: Big = withdrawMax
		? Big(assetToWithdraw.assetAmount)
		: Big(assetAmountCal.timesn(Big(1 - buffer)));

	return {
		liquidityAmount: liquidityAmount.toFixed(0),
		minAssetWithdraw: minAssetWithdraw.toFixed(0),
		minCoreWithdraw: minCoreWithdraw.toFixed(0),
	};
};

export const fetchFeeEstimate = async (
	api: Api,
	extrinsic: any,
	userFeeAssetId: number,
	maxPayment: string
) => {
	let feeEstimate: Big = await api.derive.fees.estimateFee({
		extrinsic,
		userFeeAssetId,
		maxPayment,
	});
	return feeEstimate;
};
