import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import Big from "big.js";

interface PoolExchangeInfo {
	exchangeAddress: string;
	tradeAssetBalance: number;
	coreAssetBalance: number;
}

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
	const [exchangeAddress, tradeAssetBalance, coreAssetBalance] =
		await Promise.all([
			api.derive.cennzx.exchangeAddress(tradeAsset.assetId),
			api.derive.cennzx.poolAssetBalance(tradeAsset.assetId),
			api.derive.cennzx.poolCoreAssetBalance(tradeAsset.assetId),
		]);
	const tradeBalanceNumber = new Big(tradeAssetBalance.toString());
	const coreBalanceNumber = new Big(coreAssetBalance.toString());

	return {
		exchangeAddress,
		tradeAssetBalance: tradeBalanceNumber
			.div(tradeAsset.decimalsValue)
			.toNumber(),
		coreAssetBalance: coreBalanceNumber.div(coreAsset.decimalsValue).toNumber(),
	};
}
