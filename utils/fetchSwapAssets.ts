import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchCENNZAssets from "@/utils/fetchCENNZAssets";

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
		assets.map(async ({ assetId, symbol }) => {
			if (symbol === "CPAY") return true;
			const totalLiquidity = await api.derive.cennzx.totalLiquidity(assetId);
			return totalLiquidity?.toNumber() > 0;
		})
	);

	return assets.filter((asset, index) => liquidityPredicates[index]);
}
