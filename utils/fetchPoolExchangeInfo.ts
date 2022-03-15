import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";

interface PoolExchangeInfo {
	exchangeAddress: string;
	tradeAssetBalance: number;
	coreAssetBalance: number;
}

/**
 * Fetch pool exchange info of a given `assetId``
 *
 * @param {Api} api
 * @param {number} assetId
 * @return {Promise<PoolExchangeInfo>}
 */
export default async function fetchPoolExchangeInfo(
	api: Api,
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
): Promise<PoolExchangeInfo> {
	const [exchangeAddress, tradeAssetBalance, coreAssetBalance] =
		await Promise.all([
			api.derive.cennzx.exchangeAddress(tradeAsset.assetId),
			api.derive.cennzx.poolAssetBalance(tradeAsset.assetId),
			api.derive.cennzx.poolCoreAssetBalance(tradeAsset.assetId),
		]);

	return {
		exchangeAddress,
		tradeAssetBalance: tradeAssetBalance.toNumber() / tradeAsset.decimalsValue,
		coreAssetBalance: coreAssetBalance.toNumber() / coreAsset.decimalsValue,
	};
}
