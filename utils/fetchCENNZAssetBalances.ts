import { Api } from "@cennznet/api";
import { CENNZAssetBalance } from "@/types";
import fetchCENNZnetAssets from "@/utils/fetchCENNZnetAssets";

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
	const assets = await fetchCENNZnetAssets(api);

	return await Promise.all(
		(
			await api.query.genericAsset.freeBalance.multi(
				assets.map(({ assetId }) => [assetId, address])
			)
		).map((balance, index) => {
			const asset = assets[index];

			return {
				...asset,
				rawValue: balance,
				value: (balance as any) / Math.pow(10, asset.decimals),
			};
		})
	);
}
