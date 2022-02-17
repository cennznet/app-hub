import { Api } from "@cennznet/api";
import {
	AssetInfo,
	IExchangePool,
	IUserShareInPool,
	PoolValues,
} from "../../types";
import { Amount, AmountUnit } from "../Amount";

export const fetchCoreAmount = (
	tradeAmount: number,
	exchangePool: IExchangePool
) => {
	const coreAmount =
		(tradeAmount * exchangePool.coreAssetBalance.toNumber()) /
		exchangePool.assetBalance.toNumber();

	if (coreAmount <= 0) return 0;
	return coreAmount;
};

export const fetchTradeAmount = (
	coreAmount: number,
	exchangePool: IExchangePool
) => {
	const tradeAmount =
		(coreAmount * exchangePool.assetBalance.toNumber()) /
		exchangePool.coreAssetBalance.toNumber();

	if (tradeAmount <= 0) return 0;
	return tradeAmount;
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
	asset: AssetInfo,
	assetAmount: Amount,
	coreAsset: AssetInfo,
	coreAmount: Amount
) => {
	const totalLiquidity = await api.derive.cennzx.totalLiquidity(asset.id);

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
	asset: AssetInfo,
	assetAmount: Amount,
	coreAsset: AssetInfo,
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
	asset: AssetInfo,
	address: string,
	assetAmount: Amount,
	coreAsset: AssetInfo,
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
			asset.id,
			address
		);
		assetToWithdraw = await api.derive.cennzx.assetToWithdraw(
			asset.id,
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
