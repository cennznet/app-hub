import { Api } from "@cennznet/api";
import { AssetId, AssetInfoV41 as AssetInfo } from "@cennznet/types";
import { hexToString } from "@polkadot/util";
import { CENNZAsset } from "@/types";

export default async function fetchCENNZAssets(
	api: Api
): Promise<CENNZAsset[]> {
	const registeredAssets = await (
		api.rpc as any
	).genericAsset.registeredAssets();
	0;

	return registeredAssets
		.map((registeredAsset: [AssetId, AssetInfo]) => {
			const [assetId, { symbol, decimalPlaces }] = registeredAsset;

			return {
				assetId: assetId.toJSON(),
				symbol: hexToString(symbol.toJSON()),
				decimals: decimalPlaces.toNumber(),
				decimalsValue: Math.pow(10, decimalPlaces.toNumber()),
			};
		})
		.filter(({ assetId, symbol }) => !!assetId && !!symbol)
		.sort((a: CENNZAsset, b: CENNZAsset) => a.assetId - b.assetId);
}
