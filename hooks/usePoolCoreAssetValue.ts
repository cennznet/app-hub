import { usePool } from "@/providers/PoolProvider";
import { Balance } from "@/utils";
import { useCallback, useEffect, useState } from "react";

interface PoolCoreAssetValueHook {
	coreAssetValue: Balance;
}

export default function usePoolCoreAssetValue(
	tradeAssetValue: string
): PoolCoreAssetValueHook {
	const [coreAssetValue, setCoreAssetValue] = useState<Balance>(null);
	const {
		tradeAsset,
		coreAsset,
		exchangeInfo,
		userInfo,
		poolAction,
		tradeValue,
		coreValue,
	} = usePool();

	const setCoreAssetValueByTradeAsset = useCallback(() => {
		if (!exchangeInfo) return;
		const zeroValue = Balance.fromInput("0", coreAsset);
		const { coreAssetReserve, tradeAssetReserve } = exchangeInfo;
		const trValue = Balance.fromInput(tradeAssetValue, tradeAsset);

		if (tradeAsset.symbol !== tradeAssetReserve.getSymbol()) return;

		if (tradeAssetReserve.eq(0)) return setCoreAssetValue(zeroValue);

		const crValue = trValue
			.mul(coreAssetReserve)
			.div(tradeAssetReserve)
			.minus(1)
			.withCoin(coreAsset);

		setCoreAssetValue(crValue.lt(0) ? zeroValue : crValue);
	}, [exchangeInfo, tradeAssetValue, tradeAsset, coreAsset]);

	const setCoreAssetValueByLiquidity = useCallback(() => {
		if (!exchangeInfo || !userInfo) return;
		const { exchangeLiquidity, coreAssetReserve } = exchangeInfo;
		const { tradeAssetBalance, userLiquidity } = userInfo;
		const zeroValue = Balance.fromInput("0", coreAsset);
		const trValue = Balance.fromInput(tradeAssetValue, tradeAsset);

		if (exchangeLiquidity.eq(0)) return setCoreAssetValue(zeroValue);

		const liquidityValue = trValue.div(tradeAssetBalance).mul(userLiquidity);
		const crValue = liquidityValue
			.mul(coreAssetReserve)
			.div(exchangeLiquidity)
			.withCoin(coreAsset);

		setCoreAssetValue(crValue.lt(0) ? zeroValue : crValue);
	}, [exchangeInfo, tradeAssetValue, userInfo, tradeAsset, coreAsset]);

	const setCoreAssetValueByInput = useCallback(() => {
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

		if (trInputValue.eq(0)) return setCoreAssetValue(zeroValue);

		const crValue = crInputValue
			.mul(trValue)
			.div(trInputValue)
			.withCoin(coreAsset);

		setCoreAssetValue(crValue.lt(0) ? zeroValue : crValue);
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
		if (exchangeLiquidity.eq(0)) return setCoreAssetValueByInput();
		setCoreAssetValueByTradeAsset();
	}, [
		setCoreAssetValueByTradeAsset,
		setCoreAssetValueByInput,
		poolAction,
		exchangeInfo,
	]);

	// For "Remove" action
	useEffect(() => {
		if (poolAction !== "Remove" || !userInfo || !exchangeInfo) return;

		const { exchangeLiquidity } = exchangeInfo;
		if (exchangeLiquidity.eq(0)) return setCoreAssetValueByInput();

		const { userLiquidity } = userInfo;
		if (userLiquidity.eq(0)) return setCoreAssetValueByTradeAsset();
		setCoreAssetValueByLiquidity();
	}, [
		userInfo,
		exchangeInfo,
		setCoreAssetValueByLiquidity,
		setCoreAssetValueByTradeAsset,
		setCoreAssetValueByInput,
		poolAction,
	]);

	return { coreAssetValue };
}
