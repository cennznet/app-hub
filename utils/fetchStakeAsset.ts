import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchCENNZAssets from "@/utils/fetchCENNZAssets";
import { CENNZ_ASSET_ID } from "@/constants";

/**
 * Fetch and returns staking asset CENNZ
 *
 * @param {Api} api
 * @return {Promise<CENNZAsset>}
 */
export default async function fetchPoolAssets(api: Api): Promise<CENNZAsset> {
	return (await fetchCENNZAssets(api)).find(
		(asset) => asset.assetId === CENNZ_ASSET_ID
	);
}
