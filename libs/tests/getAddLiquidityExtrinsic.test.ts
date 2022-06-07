import getAddLiquidityExtrinsic from "@/libs/utils/getAddLiquidityExtrinsic";
import { Balance, fetchPoolExchangeInfo } from "@/libs/utils";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = getCENNZCoreAssetsForTest();

describe("getAddLiquidityExtrinsic", () => {
	it("defines extrinsic with correct values", async () => {
		const exchangeInfo = await fetchPoolExchangeInfo(
			api,
			cennzAsset,
			cpayAsset
		);

		const coreAssetValue = new Balance(10, cpayAsset);
		const tradeAssetValue = new Balance(10, cennzAsset);
		const slippage = 5;

		const extrinsic = (await getAddLiquidityExtrinsic(
			api,
			exchangeInfo,
			cennzAsset.assetId,
			tradeAssetValue,
			coreAssetValue,
			slippage
		)) as any;

		const { coreAssetReserve, exchangeLiquidity } = exchangeInfo;
		const minLiquidity = coreAssetReserve.gt(0)
			? coreAssetValue
					.mul(exchangeLiquidity)
					.div(coreAssetReserve)
					.decrease(slippage)
			: coreAssetValue;
		const maxTradeAmount = tradeAssetValue.increase(slippage);

		expect(extrinsic.args[0].toJSON()).toEqual(cennzAsset.assetId);
		expect(extrinsic.args[1].toString()).toEqual(minLiquidity.toFixed(0));
		expect(extrinsic.args[2].toString()).toEqual(maxTradeAmount.toFixed(0));
		expect(extrinsic.args[3].toString()).toEqual(coreAssetValue.toFixed(0));
	});
});
