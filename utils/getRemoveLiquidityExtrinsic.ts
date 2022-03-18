import { CENNZAsset, PoolUserInfo } from "@/types";
import { Balance } from "@/utils";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";

// TODO: Need test
export default function getRemoveLiquidityExtrinsic(
	api: Api,
	userInfo: PoolUserInfo,
	tradeAsset: CENNZAsset,
	tradeAssetValue: Balance,
	coreAssetValue: Balance,
	slippagePercentage: number
): SubmittableExtrinsic<"promise"> {
	const { coreAssetBalance, userLiquidity } = userInfo;

	const liquidityAmount = coreAssetBalance.gt(0)
		? userLiquidity.mul(coreAssetValue).div(coreAssetBalance)
		: coreAssetValue;
	const minTradeAmount = tradeAssetValue.mul(1 - slippagePercentage / 100);
	const minCoreAmount = coreAssetValue.mul(1 - slippagePercentage / 100);

	return api.tx.cennzx.removeLiquidity(
		tradeAsset.assetId,
		liquidityAmount.toFixed(0),
		minTradeAmount.toFixed(0),
		minCoreAmount.toFixed(0)
	);
}
