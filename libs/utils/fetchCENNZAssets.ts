import { Api } from "@cennznet/api";
import { AssetId, AssetInfoV41 as AssetInfo } from "@cennznet/types";
import { hexToString } from "@polkadot/util";
import { CENNZAsset } from "@/libs/types";
import { ALLOWED_ASSET_IDS } from "@/libs/constants";

/**
 * Fetch all registered assets from CENNZnet Network then
 * go through a few filters:
 *
 * 1) Has `symbol` and `assetId` defined (non-test Generic Assets)
 * 2) Belongs to the `ALLOWED_ASSET_IDS` list (pure Generic Assets)
 * 3) Has a valid ERC20 Address (bridged Generic Assets)
 *
 * @param {Api} api
 * @return {Promise<CENNZAsset[]>}
 */
export default async function fetchCENNZAssets(
	api: Api
): Promise<CENNZAsset[]> {
	const registeredAssets: [AssetId, AssetInfo][] =
		await api.rpc.genericAsset.registeredAssets();

	// Split up pure Generic Assets with (potential) bridged Generic Assets
	const { pureAssets, potentialBridgedAssets } = registeredAssets
		.map((registeredAsset) => {
			const [assetId, { symbol, decimalPlaces }] = registeredAsset;

			return {
				assetId: assetId.toJSON(),
				symbol: hexToString(symbol.toJSON()),
				decimals: decimalPlaces.toNumber(),
				decimalsValue: Math.pow(10, decimalPlaces.toNumber()),
			} as CENNZAsset;
		})
		.filter(({ assetId, symbol }) => !!assetId && !!symbol)
		.reduce(
			(output, asset) => {
				if (ALLOWED_ASSET_IDS.includes(asset.assetId)) {
					output.pureAssets.push(asset);
					return output;
				}

				output.potentialBridgedAssets.push(asset);
				return output;
			},
			{
				pureAssets: [] as CENNZAsset[],
				potentialBridgedAssets: [] as CENNZAsset[],
			}
		);

	const bridgeAssets = (
		await Promise.all(
			potentialBridgedAssets.map(async (asset) => {
				const tokenAddress = await api.query.erc20Peg.assetIdToErc20(
					asset.assetId
				);
				if (!tokenAddress.toString()) return null;
				return asset;
			})
		)
	).filter(Boolean);

	return []
		.concat(pureAssets, bridgeAssets)
		.sort((a: CENNZAsset, b: CENNZAsset) => a.assetId - b.assetId);
}
