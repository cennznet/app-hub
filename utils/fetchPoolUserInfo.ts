import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import Big from "big.js";
import { PoolUserInfo } from "@/types";

/**
 * Fetch user share of a liquidity pool
 *
 * @param {string} api
 * @param {string} userAddress
 * @param {CENNZAsset} tradeAsset
 * @param {CENNZAsset} coreAsset
 * @return {Promise<PoolUserInfo>}
 */
export default async function fetchPoolUserInfo(
	api: Api,
	userAddress: string,
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
): Promise<PoolUserInfo> {
	const [{ asset, core }, currentLiquidity] = await Promise.all([
		await (api.rpc as any).cennzx.liquidityValue(
			userAddress,
			tradeAsset.assetId
		),
		await api.derive.cennzx.liquidityBalance(tradeAsset.assetId, userAddress),
	]);

	const assetNumber = new Big(asset.toString());
	const coreNumber = new Big(core.toString());
	const liquidityNumber = new Big(currentLiquidity.toString());

	return {
		userAddress,
		tradeAssetBalance: assetNumber.div(tradeAsset.decimalsValue).toNumber(),
		coreAssetBalance: coreNumber.div(coreAsset.decimalsValue).toNumber(),
		userLiquidity: liquidityNumber.toNumber(),
	};
}
