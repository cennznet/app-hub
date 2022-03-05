import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { CENNZAsset } from "@/types";
import { fetchCENNZAssets, fetchGasFee } from "@/utils";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { useEffect, useState } from "react";

const CPAY_ASSET_ID = Number(process.env.NEXT_PUBLIC_CPAY_ID);

export default function useGasFee(
	extrinsic: SubmittableExtrinsic<"promise">
): [number, CENNZAsset] {
	const [gasFee, setGasFee] = useState<number>();
	const [gasAsset, setGasAsset] = useState<CENNZAsset>();
	const { api } = useCENNZApi();

	useEffect(() => {
		if (!api || !extrinsic) return;

		(async () => {
			const cennzAssets = await fetchCENNZAssets(api);
			const gasAsset = !!cennzAssets?.length
				? cennzAssets.find((balance) => balance.assetId === CPAY_ASSET_ID)
				: null;

			const gasFee = await fetchGasFee(api, extrinsic, gasAsset);

			setGasAsset(gasAsset);
			setGasFee(gasFee);
		})();
	}, [api, extrinsic]);

	return [gasFee, gasAsset];
}
