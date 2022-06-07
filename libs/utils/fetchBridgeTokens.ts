import {
	BridgeAction,
	BridgedEthereumToken,
	EthereumToken,
} from "@/libs/types";
import { AssetId, AssetInfoV41 as AssetInfo } from "@cennznet/types";
import { fetchEthereumTokens } from "@/libs/utils";
import { ETH_CHAIN_ID } from "@/libs/constants";
import { Api } from "@cennznet/api";
import { hexToString } from "@polkadot/util";

type BridgeTokens<T> = T extends "Deposit"
	? EthereumToken
	: T extends "Withdraw"
	? BridgedEthereumToken
	: never;

export default async function fetchBridgeTokens<T extends BridgeAction>(
	api: Api,
	action: BridgeAction
): Promise<BridgeTokens<T>[]> {
	if (action === "Deposit")
		return (await Promise.resolve(fetchEthereumTokens(ETH_CHAIN_ID))).sort(
			(a, b) => (a.symbol > b.symbol ? 1 : -1)
		) as BridgeTokens<T>[];

	const registeredAssets: [AssetId, AssetInfo][] =
		await api.rpc.genericAsset.registeredAssets();

	return (
		await Promise.all(
			registeredAssets.map(async ([assetId, { symbol, decimalPlaces }]) => {
				const tokenAddress = await api.query.erc20Peg.assetIdToErc20(assetId);
				if (!tokenAddress.toString() || symbol?.toJSON() === "0x") return null;
				return {
					assetId: assetId.toJSON() as number,
					address: tokenAddress.toString().toLowerCase(),
					symbol: hexToString(symbol.toJSON()),
					decimals: decimalPlaces.toNumber(),
					decimalsValue: Math.pow(10, decimalPlaces.toNumber()),
				} as BridgedEthereumToken;
			})
		)
	)
		.filter(Boolean)
		.sort((a, b) => {
			if (a.address > b.address) return 1;
			if (a.address < b.address) return -1;
			return 0;
		}) as BridgeTokens<T>[];
}
