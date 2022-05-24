import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/libs/types";
import { fetchCENNZAssets } from "@utils";
import { CPAY_ASSET_ID } from "@/libs/constants";

/**
 * Fetch and retuns array of CENNZnetAsset that are swapable
 * We use `totalLiquidity` value to determine if token is swappable or not
 *
 * @param {Api} api
 * @return {Promise<CENNZAsset[]>}
 */
export default async function fetchSwapAssets(api: Api): Promise<CENNZAsset[]> {
	const assets = await fetchCENNZAssets(api);
	const liquidityPredicates = await Promise.all(
		assets.map(async ({ assetId }) => {
			if (assetId === CPAY_ASSET_ID) return true;
			const totalLiquidity = await api.derive.cennzx.totalLiquidity(assetId);
			return totalLiquidity?.toNumber() > 0;
		})
	);

	return assets.filter((asset, index) => liquidityPredicates[index]);
}
