import { Api } from "@cennznet/api";
import { StakeAssets } from "@/types";
import fetchCENNZAssets from "@/utils/fetchCENNZAssets";

/**
 * Fetch and returns staking asset CENNZ
 *
 * @param {Api} api
 * @return {Promise<StakeAssets>}
 */
export default async function fetchStakeAssets(api: Api): Promise<StakeAssets> {
	const stakeAssets = {} as StakeAssets;

	Promise.all([
		(await api.query.genericAsset.stakingAssetId()).toJSON(),
		(await api.query.genericAsset.spendingAssetId()).toJSON(),
	]).then(async ([stakingAssetId, spendingAssetId]) => {
		(await fetchCENNZAssets(api)).forEach((asset) => {
			if (asset.assetId === stakingAssetId) {
				stakeAssets.stakingAsset = asset;
			}
			if (asset.assetId === spendingAssetId) {
				stakeAssets.spendingAsset = asset;
			}
		});
	});

	return stakeAssets;
}
