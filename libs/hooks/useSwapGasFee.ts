import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { Balance, fetchGasFee, getSellAssetExtrinsic } from "@/libs/utils";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useSwap } from "@/libs/providers/SwapProvider";
import { SubmittableExtrinsic } from "@/libs/types";

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
		const gasFee = await fetchGasFee(
			api,
			extrinsic as SubmittableExtrinsic<"promise">,
			cpayAsset
		);
		setGasFee(gasFee);
		setLoading(false);
	}, [api, extrinsic, cpayAsset]);

	useEffect(() => {
		void updateGasFee?.();
	}, [updateGasFee]);

	return {
		gasFee,
		updatingGasFee: loading,
		updateGasFee,
	};
}
