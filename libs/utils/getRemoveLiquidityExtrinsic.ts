import { Balance } from "@utils";
import { Api } from "@cennznet/api";
import {
	CENNZAsset,
	CENNZnetExtrinsic,
	PoolExchangeInfo,
	SubmittableExtrinsic,
} from "@/libs/types";

export default function getRemoveLiquidityExtrinsic(
	api: Api,
	exchangeInfo: PoolExchangeInfo,
	tradeAsset: CENNZAsset,
	tradeAssetValue: Balance,
	coreAssetValue: Balance,
	slippage: number
): CENNZnetExtrinsic | SubmittableExtrinsic<"promise"> {
	const { coreAssetReserve, exchangeLiquidity } = exchangeInfo;

	const liquidityAmount = coreAssetReserve.gt(0)
		? coreAssetValue.mul(exchangeLiquidity).div(coreAssetReserve)
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
