import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchCENNZAssets from "@/utils/fetchCENNZAssets";
import { CPAY_ASSET_ID } from "@/constants";

/**
 * Fetch and returns array of CENNZAsset that
 * can be used in Liquidty Pool
 *
 * @param {Api} api
 * @return {Promise<CENNZAsset[]>}
 */
export default async function fetchPoolAssets(api: Api): Promise<CENNZAsset[]> {
	const assets = await fetchCENNZAssets(api);
	return assets.filter(({ assetId }) => assetId !== CPAY_ASSET_ID);
}
