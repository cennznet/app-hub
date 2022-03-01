import { Api } from "@cennznet/api";
import { CENNZnetAsset } from "@/types";
import fetchCENNZnetAssets from "@/utils/fetchCENNZnetAssets";

/**
 * Fetch and returns array of CENNZnetAsset that can be used in Pool
 *
 * @param {Api} api The api
 * @return {Promise<CENNZnetAsset[]>} The pool assets.
 */
export default async function fetchPoolAssets(
	api: Api
): Promise<CENNZnetAsset[]> {
	const assets = await fetchCENNZnetAssets(api);
	return assets.filter(({ symbol }) => symbol !== "CPAY");
}
