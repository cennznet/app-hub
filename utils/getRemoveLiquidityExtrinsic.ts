import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import Big from "big.js";

// TODO: Need test
export default function getRemoveLiquidityExtrinsic(
	api: Api,
	tradeAsset: CENNZAsset,
	tradeAssetValue: number,
	coreAsset: CENNZAsset,
	coreAssetValue: number,
	slippagePercentage: number
): SubmittableExtrinsic<"promise"> {
	const tradeAmount = new Big(tradeAssetValue).mul(tradeAsset.decimalsValue);
	const coreAmount = new Big(coreAssetValue).mul(coreAsset.decimalsValue);

	const minTradeAmount = tradeAmount.mul(1 - slippagePercentage / 100);
	const minCoreAmount = coreAmount.mul(1 - slippagePercentage / 100);

	return api.tx.cennzx.addLiquidity(
		tradeAsset.assetId,
		tradeAmount.toFixed(0),
		minTradeAmount.toFixed(0),
		minCoreAmount.toFixed(0)
	);
}
