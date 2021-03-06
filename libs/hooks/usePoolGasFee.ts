import { useCallback, useEffect, useState, useMemo } from "react";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { usePool } from "@/libs/providers/PoolProvider";
import {
	Balance,
	fetchGasFee,
	getAddLiquidityExtrinsic,
	getRemoveLiquidityExtrinsic,
} from "@/libs/utils";
import { SubmittableExtrinsic } from "@/libs/types";

interface PoolGasFeeHook {
	gasFee: Balance;
	updatingGasFee: boolean;
	updateGasFee: () => void;
}

export default function usePoolGasFee(): PoolGasFeeHook {
	const { api } = useCENNZApi();
	const [gasFee, setGasFee] = useState<Balance>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { tradeAsset, coreAsset, poolAction, exchangeInfo } = usePool();

	const extrinsic = useMemo(() => {
		if (!api || !exchangeInfo) return;
		if (poolAction === "Remove")
			return getRemoveLiquidityExtrinsic(
				api,
				exchangeInfo,
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
	}, [api, exchangeInfo, poolAction, tradeAsset, coreAsset]);

	const updateGasFee = useCallback(async () => {
		if (!api) return;
		setLoading(true);
		const gasFee = await fetchGasFee(
			api,
			extrinsic as SubmittableExtrinsic<"promise">,
			coreAsset
		);
		setGasFee(gasFee);
		setLoading(false);
	}, [api, extrinsic, coreAsset]);

	useEffect(() => {
		void updateGasFee?.();
	}, [updateGasFee]);

	return {
		gasFee,
		updatingGasFee: loading,
		updateGasFee,
	};
}
