import { Api } from "@cennznet/api";
import { StakeAssets } from "@/libs/types";
import fetchCENNZAssets from "@/libs/utils/fetchCENNZAssets";
import { CENNZ_NETWORK } from "@/libs/constants";

/**
 * Fetch and returns staking asset CENNZ
 *
 * @param {Api} api
 * @return {Promise<StakeAssets>}
 */
export default async function fetchStakeAssets(api: Api): Promise<StakeAssets> {
	const stakeAssets = {} as StakeAssets;

	(await fetchCENNZAssets(api)).forEach((asset) => {
		if (asset.assetId === CENNZ_NETWORK.StakingAssetId) {
			stakeAssets.stakingAsset = asset;
		}
		if (asset.assetId === CENNZ_NETWORK.SpendingAssetId) {
			stakeAssets.spendingAsset = asset;
		}
	});

	return stakeAssets;
}
