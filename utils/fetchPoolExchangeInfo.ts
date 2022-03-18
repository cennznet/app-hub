import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import Big from "big.js";
import { PoolExchangeInfo } from "@/types";

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
	const [poolAddress, tradeAssetBalance, coreAssetBalance, totalLiquidity] =
		await Promise.all([
			api.derive.cennzx.exchangeAddress(tradeAsset.assetId),
			api.derive.cennzx.poolAssetBalance(tradeAsset.assetId),
			api.derive.cennzx.poolCoreAssetBalance(tradeAsset.assetId),
			api.derive.cennzx.totalLiquidity(tradeAsset.assetId),
		]);

	const tradeReserveNumber = new Big(tradeAssetBalance.toString());
	const coreReserveNumber = new Big(coreAssetBalance.toString());
	const liquidityNumber = new Big(totalLiquidity.toString());

	return {
		poolAddress,
		tradeAssetReserve: tradeReserveNumber
			.div(tradeAsset.decimalsValue)
			.toNumber(),
		coreAssetReserve: coreReserveNumber.div(coreAsset.decimalsValue).toNumber(),
		poolLiquidity: liquidityNumber.toNumber(),
	};
}
