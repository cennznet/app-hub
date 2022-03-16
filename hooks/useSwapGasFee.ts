import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { fetchGasFee, getBuyAssetExtrinsic } from "@/utils";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSwap } from "@/providers/SwapProvider";
import { CENNZAsset } from "@/types";

export default function useSwapGasFee(): {
	gasFee: number;
	gasAsset: CENNZAsset;
	updatingGasFee: boolean;
	updateGasFee: () => void;
} {
	const { api } = useCENNZApi();
	const [gasFee, setGasFee] = useState<number>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { exchangeAsset, receiveAsset, cpayAsset } = useSwap();

	const extrinsic = useMemo(
		() =>
			!!api
				? getBuyAssetExtrinsic(api, exchangeAsset, 1, receiveAsset, 1, 5)
				: null,
		[api, exchangeAsset, receiveAsset]
	);

	const updateGasFee = useCallback(async () => {
		if (!api) return;
		setLoading(true);
		const gasFee = await fetchGasFee(api, extrinsic, cpayAsset);
		setGasFee(gasFee);
		setLoading(false);
	}, [api, extrinsic, cpayAsset]);

	useEffect(() => {
		updateGasFee?.();
	}, [updateGasFee]);

	return {
		gasFee,
		gasAsset: cpayAsset,
		updatingGasFee: loading,
		updateGasFee,
	};
}
