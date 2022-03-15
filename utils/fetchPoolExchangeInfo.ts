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
	assetId: number
): Promise<PoolExchangeInfo> {
	const [exchangeAddress, tradeAssetBalance, coreAssetBalance] =
		await Promise.all([
			api.derive.cennzx.exchangeAddress(assetId),
			api.derive.cennzx.poolAssetBalance(assetId),
			api.derive.cennzx.poolCoreAssetBalance(assetId),
		]);

	return {
		exchangeAddress,
		tradeAssetBalance: tradeAssetBalance.toNumber(),
		coreAssetBalance: coreAssetBalance.toNumber(),
	};
}
