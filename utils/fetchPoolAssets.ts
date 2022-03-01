import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchCENNZnetAssets from "@/utils/fetchCENNZnetAssets";

/**
 * Fetch and returns array of CENNZnetAsset that can be used in Pool
 *
 * @param {Api} api The api
 * @return {Promise<CENNZAsset[]>} The pool assets.
 */
export default async function fetchPoolAssets(api: Api): Promise<CENNZAsset[]> {
  const assets = await fetchCENNZnetAssets(api);
  return assets.filter(({ symbol }) => symbol !== "CPAY");
}
