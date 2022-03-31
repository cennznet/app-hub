import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { Balance, fetchGasFee, getSellAssetExtrinsic } from "@/utils";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSwap } from "@/providers/SwapProvider";

export default function useSwapGasFee(): {
	gasFee: Balance;
	updatingGasFee: boolean;
	updateGasFee: () => void;
} {
	const { api } = useCENNZApi();
	const [gasFee, setGasFee] = useState<Balance>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const { exchangeAsset, receiveAsset, cpayAsset } = useSwap();

	const extrinsic = useMemo(
		() =>
			!!api
				? getSellAssetExtrinsic(
						api,
						exchangeAsset.assetId,
						Balance.fromInput("1", exchangeAsset),
						receiveAsset.assetId,
						Balance.fromInput("1", receiveAsset),
						5
				  )
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
		updatingGasFee: loading,
		updateGasFee,
	};
}
