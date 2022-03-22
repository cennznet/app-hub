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
	const {
		tradeAsset,
		coreAsset,
		exchangeInfo,
		userInfo,
		poolAction,
		tradeValue,
		coreValue,
	} = usePool();

	const setExchangeRateByTradeAsset = useCallback(() => {
		if (!exchangeInfo) return;
		const zeroValue = Balance.fromInput("0", coreAsset);
		const { coreAssetReserve, tradeAssetReserve } = exchangeInfo;
		const trValue = Balance.fromInput(tradeAssetValue, tradeAsset);

		if (tradeAsset.symbol !== tradeAssetReserve.getSymbol()) return;

		if (tradeAssetReserve.eq(0)) return setExchangeRate(zeroValue);

		const crValue = trValue
			.mul(coreAssetReserve)
			.div(tradeAssetReserve)
			.minus(1)
			.withCoin(coreAsset);

		setExchangeRate(crValue.lt(0) ? zeroValue : crValue);
	}, [exchangeInfo, tradeAssetValue, tradeAsset, coreAsset]);

	const setExchangeRateByLiquidity = useCallback(() => {
		if (!exchangeInfo || !userInfo) return;
		const { exchangeLiquidity, coreAssetReserve } = exchangeInfo;
		const { tradeAssetBalance, userLiquidity } = userInfo;
		const zeroValue = Balance.fromInput("0", coreAsset);
		const trValue = Balance.fromInput(tradeAssetValue, tradeAsset);

		if (exchangeLiquidity.eq(0)) return setExchangeRate(zeroValue);

		const liquidityValue = trValue.div(tradeAssetBalance).mul(userLiquidity);
		const crValue = liquidityValue
			.mul(coreAssetReserve)
			.div(exchangeLiquidity)
			.withCoin(coreAsset);

		setExchangeRate(crValue.lt(0) ? zeroValue : crValue);
	}, [exchangeInfo, tradeAssetValue, userInfo, tradeAsset, coreAsset]);

	const setExchangeRateByInput = useCallback(() => {
		const crInputValue = Balance.fromInput(
			coreValue.value,
			coreAsset
		).withDecimals(0);

		const trInputValue = Balance.fromInput(
			tradeValue.value,
			tradeAsset
		).withDecimals(0);
		const trValue = Balance.fromInput(tradeAssetValue, tradeAsset);
		const zeroValue = Balance.fromInput("0", coreAsset);

		if (trInputValue.eq(0)) return setExchangeRate(zeroValue);

		const crValue = crInputValue
			.mul(trValue)
			.div(trInputValue)
			.withCoin(coreAsset);

		setExchangeRate(crValue.lt(0) ? zeroValue : crValue);
	}, [
		coreValue.value,
		coreAsset,
		tradeValue.value,
		tradeAsset,
		tradeAssetValue,
	]);

	// For "Add" action
	useEffect(() => {
		if (poolAction !== "Add" || !exchangeInfo) return;
		const { exchangeLiquidity } = exchangeInfo;
		if (exchangeLiquidity.eq(0)) return setExchangeRateByInput();
		setExchangeRateByTradeAsset();
	}, [
		setExchangeRateByTradeAsset,
		setExchangeRateByInput,
		poolAction,
		exchangeInfo,
	]);

	// For "Remove" action
	useEffect(() => {
		if (poolAction !== "Remove" || !userInfo || !exchangeInfo) return;

		const { exchangeLiquidity } = exchangeInfo;
		if (exchangeLiquidity.eq(0)) return setExchangeRateByInput();

		const { userLiquidity } = userInfo;
		if (userLiquidity.eq(0)) return setExchangeRateByTradeAsset();
		setExchangeRateByLiquidity();
	}, [
		userInfo,
		exchangeInfo,
		setExchangeRateByLiquidity,
		setExchangeRateByTradeAsset,
		setExchangeRateByInput,
		poolAction,
	]);

	return { exchangeRate };
}
