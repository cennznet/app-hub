import { CENNZAsset, PoolUserInfo } from "@/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import Big from "big.js";

// TODO: Need test
export default function getRemoveLiquidityExtrinsic(
	api: Api,
	userInfo: PoolUserInfo,
	tradeAsset: CENNZAsset,
	tradeAssetValue: number,
	coreAsset: CENNZAsset,
	coreAssetValue: number,
	slippagePercentage: number
): SubmittableExtrinsic<"promise"> {
	const tradeValue = new Big(tradeAssetValue);
	const coreValue = new Big(coreAssetValue);
	const liquidityValue = new Big(userInfo.userLiquidity);

	const liquidityAmount =
		userInfo.coreAssetBalance !== 0
			? liquidityValue.mul(coreValue).div(userInfo.coreAssetBalance)
			: coreValue.mul(coreAsset.decimalsValue);

	const minTradeAmount = tradeValue
		.mul(tradeAsset.decimalsValue)
		.mul(1 - slippagePercentage / 100);
	const minCoreAmount = coreValue
		.mul(coreAsset.decimalsValue)
		.mul(1 - slippagePercentage / 100);

	return api.tx.cennzx.removeLiquidity(
		tradeAsset.assetId,
		liquidityAmount.toFixed(0),
		minTradeAmount.toFixed(0),
		minCoreAmount.toFixed(0)
	);
}
