import { CENNZAsset } from "@/libs/types";
import { Api } from "@cennznet/api";
import { Balance } from "@utils";
import { PoolUserInfo } from "@/libs/types";

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
		await api.rpc.cennzx.liquidityValue(userAddress, tradeAsset.assetId),
		await api.derive.cennzx.liquidityBalance(tradeAsset.assetId, userAddress),
	]);

	const tradeAssetBalance = Balance.fromBN(asset, tradeAsset);
	const coreAssetBalance = Balance.fromBN(core, coreAsset);
	const userLiquidity = Balance.fromBN(currentLiquidity, null);

	return {
		userAddress,
		tradeAssetBalance,
		coreAssetBalance,
		userLiquidity,
	};
}
