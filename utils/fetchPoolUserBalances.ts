import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import Big from "big.js";

interface PoolUserBalances {
	coreBalance: number;
	tradeBalance: number;
}

/**
 * Fetch user share of a liquidity pool
 *
 * @param {string} api
 * @param {string} userAddress
 * @param {CENNZAsset} tradeAsset
 * @param {CENNZAsset} coreAsset
 * @return {Promise<PoolUserBalances>}
 */
export default async function fetchPoolUserBalances(
	api: Api,
	userAddress: string,
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
): Promise<PoolUserBalances> {
	const { asset, core } = await (api.rpc as any).cennzx.liquidityValue(
		userAddress,
		tradeAsset.assetId
	);

	const assetNumber = new Big(asset.toString());
	const coreNumber = new Big(core.toString());

	return {
		tradeBalance: assetNumber.div(tradeAsset.decimalsValue).toNumber(),
		coreBalance: coreNumber.div(coreAsset.decimalsValue).toNumber(),
	};
}
