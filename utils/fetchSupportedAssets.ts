import { Api } from "@cennznet/api";
import { AssetInfo } from "@/types";
import { u8aToString } from "@polkadot/util";

export default async function fetchSupportedAssets(
	api: Api,
	assetIds: number[]
): Promise<Array<AssetInfo>> {
	const assets = await (api.rpc as any).genericAsset.registeredAssets();
	if (!assets?.length) return [];
	return assetIds
		.map((assetId) => {
			const [tokenId, { symbol, decimalPlaces }] = assets.find((asset: any) => {
				return Number(asset[0]) === assetId;
			}) || [null, {}];

			if (!tokenId) throw new Error(`Asset id "${assetId}" not found`);

			const symbolString = u8aToString(symbol);

			return {
				id: Number(tokenId),
				symbol: symbolString,
				decimals: decimalPlaces.toNumber(),
				logo: `images/${symbolString}.svg`,
			};
		})
		.filter(Boolean);
}
