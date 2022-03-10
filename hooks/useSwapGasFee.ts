import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { CENNZAsset } from "@/types";
import { fetchCENNZAssets, fetchGasFee, getBuyAssetExtrinsic } from "@/utils";
import { CPAY_ASSET_ID } from "@/constants";
import { useEffect, useState } from "react";
import { useSwap } from "@/providers/SwapProvider";

export default function useSwapGasFee(): [number, CENNZAsset] {
	const [gasFee, setGasFee] = useState<number>();
	const [gasAsset, setGasAsset] = useState<CENNZAsset>();
	const { api } = useCENNZApi();
	const { exchangeAsset, receiveAsset } = useSwap();

	useEffect(() => {
		if (!api) return;

		const extrinsic = getBuyAssetExtrinsic(
			api,
			exchangeAsset,
			1,
			receiveAsset,
			1,
			5
		);

		(async () => {
			const cennzAssets = await fetchCENNZAssets(api);
			const gasAsset = !!cennzAssets?.length
				? cennzAssets.find((balance) => balance.assetId === CPAY_ASSET_ID)
				: null;

			const gasFee = await fetchGasFee(api, extrinsic, gasAsset);

			setGasAsset(gasAsset);
			setGasFee(gasFee);
		})();
	}, [api, exchangeAsset, receiveAsset]);

	return [gasFee, gasAsset];
}
