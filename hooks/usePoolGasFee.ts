import { useCallback, useEffect, useState, useMemo } from "react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { usePool } from "@/providers/PoolProvider";
import { CENNZAsset } from "@/types";
import {
	Balance,
	fetchGasFee,
	getAddLiquidityExtrinsic,
	getRemoveLiquidityExtrinsic,
} from "@/utils";

interface PoolGasFeeHook {
	gasFee: Balance;
	updatingGasFee: boolean;
	updateGasFee: () => void;
}

export default function usePoolGasFee(): PoolGasFeeHook {
	const { api } = useCENNZApi();
	const [gasFee, setGasFee] = useState<Balance>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { tradeAsset, coreAsset, poolAction, exchangeInfo, userInfo } =
		usePool();

	const extrinsic = useMemo(() => {
		if (!api || !exchangeInfo || !userInfo) return;
		if (poolAction === "Remove")
			return getRemoveLiquidityExtrinsic(
				api,
				userInfo,
				tradeAsset,
				Balance.fromInput("1", tradeAsset),
				Balance.fromInput("1", coreAsset),
				5
			);

		return getAddLiquidityExtrinsic(
			api,
			exchangeInfo,
			tradeAsset.assetId,
			Balance.fromInput("1", tradeAsset),
			Balance.fromInput("1", coreAsset),
			5
		);
	}, [api, exchangeInfo, poolAction, userInfo, tradeAsset, coreAsset]);

	const updateGasFee = useCallback(async () => {
		if (!api) return;
		setLoading(true);
		const gasFee = await fetchGasFee(api, extrinsic, coreAsset);
		setGasFee(gasFee);
		setLoading(false);
	}, [api, extrinsic, coreAsset]);

	useEffect(() => {
		updateGasFee?.();
	}, [updateGasFee]);

	return {
		gasFee,
		updatingGasFee: loading,
		updateGasFee,
	};
}
