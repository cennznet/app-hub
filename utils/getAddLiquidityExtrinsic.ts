import { CENNZAsset, PoolExchangeInfo } from "@/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import Big from "big.js";

// TODO: Need test
export default function getAddLiquidityExtrinsic(
	api: Api,
	exchangeInfo: PoolExchangeInfo,
	tradeAsset: CENNZAsset,
	tradeAssetValue: number,
	coreAsset: CENNZAsset,
	coreAssetValue: number,
	slippagePercentage: number
): SubmittableExtrinsic<"promise"> {
	const tradeValue = new Big(tradeAssetValue);
	const coreValue = new Big(coreAssetValue);

	const minLiquidityAmount =
		exchangeInfo.coreAssetReserve !== 0
			? coreValue
					.mul(exchangeInfo.poolLiquidity)
					.div(exchangeInfo.coreAssetReserve)
					.mul(1 - slippagePercentage / 100)
			: coreValue.mul(coreAsset.decimalsValue);

	const maxTradeAmount = tradeValue
		.mul(tradeAsset.decimalsValue)
		.mul(1 + slippagePercentage / 100);

	const coreAmount = coreValue.mul(coreAsset.decimalsValue);

	return api.tx.cennzx.addLiquidity(
		tradeAsset.assetId,
		minLiquidityAmount.toFixed(0),
		maxTradeAmount.toFixed(0),
		coreAmount.toFixed(0)
	);
}
