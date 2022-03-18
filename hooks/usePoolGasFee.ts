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
	const { tradeAsset, coreAsset, poolAction, exchangeInfo, userInfo } =
		usePool();

	const extrinsic = useMemo(() => {
		if (!api || !exchangeInfo) return;
		if (poolAction === "Remove")
			return getRemoveLiquidityExtrinsic(
				api,
				userInfo,
				tradeAsset,
				1,
				coreAsset,
				1,
				5
			);

		return getAddLiquidityExtrinsic(
			api,
			exchangeInfo,
			tradeAsset,
			1,
			coreAsset,
			1,
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
		gasAsset: coreAsset,
		updatingGasFee: loading,
		updateGasFee,
	};
}
