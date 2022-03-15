import { Api } from "@cennznet/api";
import {
	CENNZAsset,
	IExchangePool,
	IUserShareInPool,
	PoolValues,
} from "@/types";
import { Amount, AmountUnit } from "@/utils/Amount";
import { formatBalance } from "@/utils";

export const fetchCoreAmount = (
	tradeAmount: number,
	exchangePool: IExchangePool
) => {
	const coreAmount =
		(tradeAmount * Number(exchangePool.coreAssetBalance.toString())) /
		Number(exchangePool.assetBalance.toString());

	if (coreAmount <= 0) return 0;
	return coreAmount;
};

export const fetchTradeAmount = (
	coreAmount: number,
	exchangePool: IExchangePool
) => {
	const tradeAmount =
		(coreAmount * Number(exchangePool.assetBalance.toString())) /
		Number(exchangePool.coreAssetBalance.toString());

	if (tradeAmount <= 0) return 0;
	return tradeAmount;
};

export const fetchExchangeRate = (
	exchangePool: IExchangePool,
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
) => {
	const exchangeRate = exchangePool.assetBalance
		.toAmount(tradeAsset.decimals)
		.dividedBy(exchangePool.coreAssetBalance.toAmount(coreAsset.decimals));

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

// NOTE: Move to `@/utils/fetchPoolExchangeInfo.ts`
export const fetchExchangePool = async (
	api: Api,
	assetId: number
): Promise<IExchangePool> => {
	const address = await api.derive.cennzx.exchangeAddress(assetId);

	const assetBalance = new Amount(
		await api.derive.cennzx.poolAssetBalance(assetId)
	);

	const coreAssetBalance = new Amount(
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
	const liquidity: Amount = new Amount(liquidityValue.liquidity);
	const userAssetShare: Amount = new Amount(liquidityValue.asset);
	const userCoreShare: Amount = new Amount(liquidityValue.core);
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
	assetAmount: Amount,
	coreAsset: CENNZAsset,
	coreAmount: Amount
) => {
	const totalLiquidity = await api.derive.cennzx.totalLiquidity(asset.assetId);

	const assetAmountCal = new Amount(
		assetAmount,
		AmountUnit.DISPLAY,
		asset.decimals
	);
	const coreAmountCal = new Amount(
		coreAmount,
		AmountUnit.DISPLAY,
		coreAsset.decimals
	);

	return { totalLiquidity, assetAmountCal, coreAmountCal };
};

export const fetchAddLiquidityValues = async (
	api: Api,
	asset: CENNZAsset,
	assetAmount: Amount,
	coreAsset: CENNZAsset,
	coreAmount: Amount,
	exchangePool: IExchangePool,
	buffer: number
) => {
	const { totalLiquidity, assetAmountCal, coreAmountCal } =
		await calculateValues(api, asset, assetAmount, coreAsset, coreAmount);

	const minLiquidity = totalLiquidity.isZero()
		? coreAmountCal
		: new Amount(coreAmountCal).mul(
				totalLiquidity.div(exchangePool.coreAssetBalance)
		  );

	const maxAssetAmount = totalLiquidity.isZero()
		? assetAmountCal
		: new Amount(assetAmountCal.muln(1 + buffer));

	return { minLiquidity, maxAssetAmount, maxCoreAmount: coreAmountCal };
};

export const fetchWithdrawLiquidityValues = async (
	api: Api,
	asset: CENNZAsset,
	address: string,
	assetAmount: Amount,
	coreAsset: CENNZAsset,
	coreAmount: Amount,
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

	let liquidityAmount, assetToWithdraw;
	if (withdrawMax) {
		liquidityAmount = await api.derive.cennzx.liquidityBalance(
			asset.assetId,
			address
		);
		assetToWithdraw = await api.derive.cennzx.assetToWithdraw(
			asset.assetId,
			liquidityAmount
		);
	} else if (exchangePool.assetBalance === exchangePool.coreAssetBalance) {
		liquidityAmount = assetAmountCal
			.mul(totalLiquidity)
			.div(exchangePool.assetBalance);
	} else {
		liquidityAmount = assetAmountCal
			.mul(totalLiquidity)
			.div(exchangePool.assetBalance)
			.addn(1);
	}

	const coreWithdrawAmount = liquidityAmount
		.mul(exchangePool.coreAssetBalance)
		.div(totalLiquidity);

	const minCoreWithdraw = withdrawMax
		? assetToWithdraw.coreAmount
		: new Amount(coreWithdrawAmount.muln(1 - buffer));
	const minAssetWithdraw = withdrawMax
		? assetToWithdraw.assetAmount
		: new Amount(assetAmountCal.muln(1 - buffer));

	return { liquidityAmount, minAssetWithdraw, minCoreWithdraw };
};

export const fetchFeeEstimate = async (
	api: Api,
	extrinsic: any,
	userFeeAssetId: number,
	maxPayment: string
) => {
	let feeEstimate: any = await api.derive.fees.estimateFee({
		extrinsic,
		userFeeAssetId,
		maxPayment,
	});
	return new Amount(feeEstimate);
};
