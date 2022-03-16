import { useCallback, useEffect, useState, useMemo } from "react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { usePool } from "@/providers/PoolProvider";
import { CENNZAsset } from "@/types";
import {
	fetchGasFee,
	getAddLiquidityExtrinsic,
	getRemoveLiquidityExtrinsic,
} from "@/utils";

export default function usePoolGasFee(): {
	gasFee: number;
	gasAsset: CENNZAsset;
	updatingGasFee: boolean;
	updateGasFee: () => void;
} {
	const { api } = useCENNZApi();
	const [gasFee, setGasFee] = useState<number>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { tradeAsset, coreAsset, poolAction } = usePool();

	const extrinsic = useMemo(() => {
		if (!api) return;
		if (poolAction === "Remove")
			return getRemoveLiquidityExtrinsic(api, tradeAsset, 1, coreAsset, 1, 5);

		return getAddLiquidityExtrinsic(api, tradeAsset, 1, coreAsset, 1, 5);
	}, [api, poolAction, tradeAsset, coreAsset]);

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
		gasAsset: coreAsset,
		updatingGasFee: loading,
		updateGasFee,
	};
}
