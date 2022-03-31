import { usePool } from "@/providers/PoolProvider";
import { Balance } from "@/utils";
import { useCallback, useEffect, useState } from "react";

interface PoolCoreAssetValueHook {
	coreAssetValue: Balance;
}

/**
 * This hook is used to determine the `coreAssetValue` based on the `tradeAssetValue`.
 * Depends on different situations, `coreAssetValue` can be calculated in different ways
 *
 * 1) setCoreAssetValueByTradeAsset - If it's "Add" action and there is liquidity of a given assets pair
 * 2) setCoreAssetValueByLiquidity - If it's "Remove" action and user already has liquidity in
 * 3) setCoreAssetValueByInput - If there is zero liquidity in either the assets paire pool or user pool
 *
 * @param {string} tradeAssetValue The trade asset value
 * @return {PoolCoreAssetValueHook} The pool core asset value hook.
 */
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
		tradeInput,
		coreInput,
	} = usePool();

	const setCoreAssetValueByTradeAsset = useCallback(() => {
		if (!exchangeInfo) return;
		const zeroValue = Balance.fromInput("0", coreAsset);
		const { coreAssetReserve, tradeAssetReserve } = exchangeInfo;
		const trValue = Balance.fromInput(tradeAssetValue, tradeAsset);

		// This prevents a bug due to `exchangeInfo` is lagged behind
		// and `tradeAssetReserve` is holding different value / symbol
		// compares to the current `tradeAsset`
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
			coreInput.value,
			coreAsset
		).withDecimals(0);

		const trInputValue = Balance.fromInput(
			tradeInput.value,
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
		coreInput.value,
		coreAsset,
		tradeInput.value,
		tradeAsset,
		tradeAssetValue,
	]);

	// For "Add" action
	useEffect(() => {
		if (
			poolAction !== "Add" ||
			!exchangeInfo ||
			exchangeInfo?.exchangeLiquidity?.eq(0)
		)
			return;
		setCoreAssetValueByTradeAsset();
	}, [setCoreAssetValueByTradeAsset, poolAction, exchangeInfo]);

	// For "Remove" action
	useEffect(() => {
		if (
			poolAction !== "Remove" ||
			!userInfo ||
			!exchangeInfo ||
			exchangeInfo?.exchangeLiquidity?.eq(0)
		)
			return;

		const { userLiquidity } = userInfo;
		if (userLiquidity.eq(0)) return setCoreAssetValueByTradeAsset();

		setCoreAssetValueByLiquidity();
	}, [
		userInfo,
		exchangeInfo,
		setCoreAssetValueByLiquidity,
		setCoreAssetValueByTradeAsset,
		poolAction,
	]);

	// For zero liquidty
	useEffect(() => {
		if (!exchangeInfo || exchangeInfo?.exchangeLiquidity?.gt(0)) return;
		setCoreAssetValueByInput();
	}, [setCoreAssetValueByInput, exchangeInfo]);

	return { coreAssetValue };
}
