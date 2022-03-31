import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchCENNZAssets from "@/utils/fetchCENNZAssets";

/**
 * Fetch and returns array of CENNZAsset that
 * can be used in Liquidty Pool
 *
 * @param {Api} api
 * @return {Promise<CENNZAsset[]>}
 */
export default async function fetchPoolAssets(api: Api): Promise<CENNZAsset[]> {
	return await fetchCENNZAssets(api);
}
