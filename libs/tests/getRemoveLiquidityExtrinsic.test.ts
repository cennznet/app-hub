import getRemoveLiquidityExtrinsic from "@/libs/utils/getRemoveLiquidityExtrinsic";
import { Balance, fetchPoolExchangeInfo } from "@/libs/utils";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = getCENNZCoreAssetsForTest();

describe("getRemoveLiquidityExtrinsic", () => {
	it("defines extrinsic with correct values", async () => {
		const exchangeInfo = await fetchPoolExchangeInfo(
			api,
			cennzAsset,
			cpayAsset
		);

		const coreAssetValue = new Balance(10, cpayAsset);
		const tradeAssetValue = new Balance(10, cennzAsset);
		const slippage = 5;

		const extrinsic = (await getRemoveLiquidityExtrinsic(
			api,
			exchangeInfo,
			cennzAsset,
			tradeAssetValue,
			coreAssetValue,
			slippage
		)) as any;

		const { coreAssetReserve, exchangeLiquidity } = exchangeInfo;
		const liquidityAmount = coreAssetReserve.gt(0)
			? coreAssetValue.mul(exchangeLiquidity).div(coreAssetReserve)
			: coreAssetValue;
		const minTradeAmount = tradeAssetValue.decrease(slippage);
		const minCoreAmount = coreAssetValue.decrease(slippage);

		expect(extrinsic.args[0].toJSON()).toEqual(cennzAsset.assetId);
		expect(extrinsic.args[1].toString()).toEqual(liquidityAmount.toFixed(0));
		expect(extrinsic.args[2].toString()).toEqual(minTradeAmount.toFixed(0));
		expect(extrinsic.args[3].toString()).toEqual(minCoreAmount.toFixed(0));
	});
});
