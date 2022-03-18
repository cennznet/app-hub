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
	slippagePercentage: number
): SubmittableExtrinsic<"promise"> {
	const { coreAssetReserve, exchangeLiquidity } = exchangeInfo;

	const minLiquidity = coreAssetReserve.gt(0)
		? coreAssetValue
				.mul(exchangeLiquidity)
				.div(coreAssetReserve)
				.mul(1 - slippagePercentage / 100)
		: coreAssetValue;

	const maxTradeAmount = tradeAssetValue.mul(1 + slippagePercentage / 100);

	return api.tx.cennzx.addLiquidity(
		tradeAssetId,
		minLiquidity.toFixed(0),
		maxTradeAmount.toFixed(0),
		coreAssetValue.toFixed(0)
	);
}
