import { BridgeAction, EthereumToken } from "@/types";
import { AssetId, AssetInfoV41 as AssetInfo } from "@cennznet/types";
import fetchEthereumTokens from "@/utils/fetchEthereumTokens";
import { ETH_CHAIN_ID } from "@/constants";
import { Api } from "@cennznet/api";
import { hexToString } from "@polkadot/util";

export default async function fetchBridgeTokens(
	api: Api,
	action: BridgeAction
): Promise<EthereumToken[]> {
	if (action === "Deposit")
		return Promise.resolve(fetchEthereumTokens(ETH_CHAIN_ID));

	const registeredAssets: [AssetId, AssetInfo][] = await (
		api.rpc as any
	).genericAsset.registeredAssets();

	return (
		await Promise.all(
			registeredAssets.map(async ([assetId, { symbol, decimalPlaces }]) => {
				const tokenAddress = await api.query.erc20Peg.assetIdToErc20(assetId);
				if (!tokenAddress.toString() || symbol?.toJSON() === "0x") return null;
				return {
					address: tokenAddress.toString(),
					symbol: hexToString(symbol.toJSON()),
					decimals: decimalPlaces.toNumber(),
					decimalsValue: Math.pow(10, decimalPlaces.toNumber()),
				};
			})
		)
	).filter(Boolean);
}
