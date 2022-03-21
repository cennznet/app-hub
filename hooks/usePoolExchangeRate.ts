import { usePool } from "@/providers/PoolProvider";
import { Balance } from "@/utils";
import { useCallback, useEffect, useState } from "react";

interface PoolExchangeRateHook {
	exchangeRate: Balance;
}

export default function usePoolExchangeRate(
	tradeAssetValue: string
): PoolExchangeRateHook {
	const [exchangeRate, setExchangeRate] = useState<Balance>(null);
	const { tradeAsset, coreAsset, exchangeInfo, userInfo, poolAction } =
		usePool();

	const setExchangeRateByTradeAsset = useCallback(() => {
		if (!exchangeInfo || poolAction !== "Add") return;
		const { coreAssetReserve, tradeAssetReserve } = exchangeInfo;
		const zeroCoreValue = Balance.fromInput("0", coreAsset);
		const trValue = Balance.fromInput(tradeAssetValue, tradeAsset);

		if (tradeAssetReserve.eq(0)) return setExchangeRate(zeroCoreValue);

		const crValue = trValue
			.mul(coreAssetReserve)
			.div(tradeAssetReserve)
			.minus(1)
			.withCoin(coreAsset);

		setExchangeRate(crValue.lt(0) ? zeroCoreValue : crValue);
	}, [exchangeInfo, tradeAssetValue, poolAction, tradeAsset, coreAsset]);

	const setExchangeRateByLiquidity = useCallback(() => {
		if (!exchangeInfo || !userInfo) return;
		const { exchangeLiquidity, coreAssetReserve } = exchangeInfo;
		const { tradeAssetBalance, userLiquidity } = userInfo;
		const zeroCoreValue = Balance.fromInput("0", coreAsset);
		const trValue = Balance.fromInput(tradeAssetValue, tradeAsset);

		if (exchangeLiquidity.eq(0)) return setExchangeRate(zeroCoreValue);

		const liquidityValue = trValue.div(tradeAssetBalance).mul(userLiquidity);
		const crValue = liquidityValue
			.mul(coreAssetReserve)
			.div(exchangeLiquidity)
			.withCoin(coreAsset);

		setExchangeRate(crValue.lt(0) ? zeroCoreValue : crValue);
	}, [exchangeInfo, tradeAssetValue, userInfo, tradeAsset, coreAsset]);

	// For "Add" action
	useEffect(() => {
		if (poolAction !== "Add") return;
		setExchangeRateByTradeAsset();
	}, [setExchangeRateByTradeAsset, poolAction]);

	// For "Remove" action
	useEffect(() => {
		if (poolAction !== "Remove") return;
		const { userLiquidity } = userInfo;
		if (userLiquidity.eq(0)) return setExchangeRateByTradeAsset();
		setExchangeRateByLiquidity();
	}, [
		userInfo,
		setExchangeRateByLiquidity,
		setExchangeRateByTradeAsset,
		poolAction,
	]);

	return { exchangeRate };
}
