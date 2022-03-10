import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { fetchGasFee, getBuyAssetExtrinsic } from "@/utils";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSwap } from "@/providers/SwapProvider";
import { CENNZAsset } from "@/types";

export default function useSwapGasFee(): [number, CENNZAsset, () => void] {
	const [gasFee, setGasFee] = useState<number>();
	const { api } = useCENNZApi();
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
		setGasFee(null);
		const gasFee = await fetchGasFee(api, extrinsic, cpayAsset);
		setGasFee(gasFee);
	}, [api, extrinsic, cpayAsset]);

	useEffect(() => {
		updateGasFee?.();
	}, [updateGasFee]);

	return [gasFee, cpayAsset, updateGasFee];
}
