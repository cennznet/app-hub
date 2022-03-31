import { CENNZAsset, PoolExchangeInfo } from "@/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { Balance } from "@/utils";

// TODO: Need test
export default function getAddLiquidityExtrinsic(
	api: Api,
	exchangeInfo: PoolExchangeInfo,
	tradeAssetId: CENNZAsset["assetId"],
	tradeAssetValue: Balance,
	coreAssetValue: Balance,
	slippage: number
): SubmittableExtrinsic<"promise"> {
	const { coreAssetReserve, exchangeLiquidity } = exchangeInfo;

	const minLiquidity = coreAssetReserve.gt(0)
		? coreAssetValue
				.mul(exchangeLiquidity)
				.div(coreAssetReserve)
				.decrease(slippage)
		: coreAssetValue;

	const maxTradeAmount = tradeAssetValue.increase(slippage);

	return api.tx.cennzx.addLiquidity(
		tradeAssetId,
		minLiquidity.toFixed(0),
		maxTradeAmount.toFixed(0),
		coreAssetValue.toFixed(0)
	);
}
