import { Api } from "@cennznet/api";
import { CENNZAssetBalance } from "@/types";
import fetchCENNZAssets from "@/utils/fetchCENNZAssets";
import { Balance } from "@/utils";

/**
 * Fetch balances of all registered CENNZ assets from a wallet address
 *
 * @param {Api} api
 * @param {string} address
 * @return {Promise<BalanceInfo[]>}
 */
export default async function fetchCENNZAssetBalances(
	api: Api,
	address: string
): Promise<CENNZAssetBalance[]> {
	const assets = await fetchCENNZAssets(api);

	return await Promise.all(
		(
			await api.query.genericAsset.freeBalance.multi(
				assets.map(({ assetId }) => [assetId, address])
			)
		).map((balance, index) => {
			const asset = assets[index];

			return {
				...asset,
				value: Balance.fromCodec(balance, asset),
			};
		})
	);
}
