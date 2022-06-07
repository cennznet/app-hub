import { CENNZAsset } from "@/libs/types";
import { Api } from "@cennznet/api";
import { PoolExchangeInfo } from "@/libs/types";
import { Balance } from "@/libs/utils";

/**
 * Fetch pool exchange info of a given `assetId``
 *
 * @param {Api} api The api
 * @param {CENNZAsset} tradeAsset
 * @param {CENNZAsset} coreAsset
 * @return {Promise<PoolExchangeInfo>}
 */
export default async function fetchPoolExchangeInfo(
	api: Api,
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
): Promise<PoolExchangeInfo> {
	const [exchangeAddress, tradeAssetBalance, coreAssetBalance, totalLiquidity] =
		await Promise.all([
			api.derive.cennzx.exchangeAddress(tradeAsset.assetId),
			api.derive.cennzx.poolAssetBalance(tradeAsset.assetId),
			api.derive.cennzx.poolCoreAssetBalance(tradeAsset.assetId),
			api.derive.cennzx.totalLiquidity(tradeAsset.assetId),
		]);

	const tradeAssetReserve = Balance.fromBN(tradeAssetBalance, tradeAsset);
	const coreAssetReserve = Balance.fromBN(coreAssetBalance, coreAsset);
	const exchangeLiquidity = Balance.fromBN(totalLiquidity, null);

	return {
		exchangeAddress,
		tradeAssetReserve,
		coreAssetReserve,
		exchangeLiquidity,
	};
}
