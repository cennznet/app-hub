import { CENNZAsset, PoolExchangeInfo } from "@/types";
import { Balance } from "@/utils";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";

// TODO: Need test
export default function getRemoveLiquidityExtrinsic(
	api: Api,
	exchangeInfo: PoolExchangeInfo,
	tradeAsset: CENNZAsset,
	tradeAssetValue: Balance,
	coreAssetValue: Balance,
	slippage: number
): SubmittableExtrinsic<"promise"> {
	const { tradeAssetReserve, exchangeLiquidity } = exchangeInfo;

	const liquidityAmount = tradeAssetReserve.gt(0)
		? tradeAssetValue.mul(exchangeLiquidity).div(tradeAssetReserve)
		: coreAssetValue;
	const minTradeAmount = tradeAssetValue.decrease(slippage);
	const minCoreAmount = coreAssetValue.decrease(slippage);

	return api.tx.cennzx.removeLiquidity(
		tradeAsset.assetId,
		liquidityAmount.toFixed(0),
		minTradeAmount.toFixed(0),
		minCoreAmount.toFixed(0)
	);
}
