import getRemoveLiquidityExtrinsic from "@/utils/getRemoveLiquidityExtrinsic";
import { Balance, fetchPoolExchangeInfo } from "@/utils";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = getCENNZCoreAssetsForTest();

describe("getRemoveLiquidityExtrinsic", () => {
	it("returns expected extrinsic", async () => {
		const exchangeInfo = await fetchPoolExchangeInfo(
			api,
			cennzAsset,
			cpayAsset
		);

		const coreAssetValue = new Balance(10, cpayAsset);
		const tradeAssetValue = new Balance(10, cennzAsset);
		const slippage = 5;

		const extrinsic = await getRemoveLiquidityExtrinsic(
			api,
			exchangeInfo,
			cennzAsset,
			tradeAssetValue,
			coreAssetValue,
			slippage
		);

		const { coreAssetReserve, exchangeLiquidity } = exchangeInfo;
		const liquidityAmount = coreAssetReserve.gt(0)
			? coreAssetValue.mul(exchangeLiquidity).div(coreAssetReserve)
			: coreAssetValue;
		const minTradeAmount = tradeAssetValue.decrease(slippage);
		const minCoreAmount = coreAssetValue.decrease(slippage);

		const expected = api.tx.cennzx.removeLiquidity(
			cennzAsset.assetId,
			liquidityAmount.toFixed(0),
			minTradeAmount.toFixed(0),
			minCoreAmount.toFixed(0)
		);

		expect(extrinsic).toEqual(expected);
	});
});
