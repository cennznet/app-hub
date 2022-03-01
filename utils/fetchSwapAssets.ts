import { Api } from "@cennznet/api";
import { CENNZnetAsset } from "@/types";
import fetchCENNZnetAssets from "@/utils/fetchCENNZnetAssets";

/**
 * Fetch and retuns array of CENNZnetAsset that are swapable
 * We use `totalLiquidity` value to determine if token is swappable or not
 *
 * @param {Api} api
 * @return {Promise<CENNZnetAsset[]>}
 */
export default async function fetchSwapAssets(
	api: Api
): Promise<CENNZnetAsset[]> {
	const assets = await fetchCENNZnetAssets(api);
	const liquidityPredicates = await Promise.all(
		assets.map(async ({ assetId, symbol }) => {
			if (symbol === "CPAY") return true;
			const totalLiquidity = await api.derive.cennzx.totalLiquidity(assetId);
			return totalLiquidity?.toNumber() > 0;
		})
	);

	return assets.filter((asset, index) => liquidityPredicates[index]);
}
