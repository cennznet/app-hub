import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import Big from "big.js";

// TODO: Need test
export default function getAddLiquidityExtrinsic(
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
	const maxTradeAmount = tradeAmount.mul(1 + slippagePercentage / 100);

	return api.tx.cennzx.addLiquidity(
		tradeAsset.assetId,
		minTradeAmount.toFixed(0),
		maxTradeAmount.toFixed(0),
		coreAmount.toFixed(0)
	);
}
