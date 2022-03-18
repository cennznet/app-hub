import getRemoveLiquidityExtrinsic from "@/utils/getRemoveLiquidityExtrinsic";
import { PoolUserInfo } from "@/types";
import Balance from "@/utils/Balance";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();

describe("getRemoveLiquidityExtrinsic", () => {
	it("returns expected results", async () => {
		const userLiquidity = new Balance(5000500, 4, "CENNZ");

		console.log(userLiquidity, userLiquidity.toBalance({ withSymbol: true }));

		// const userInfo: PoolUserInfo = {
		// 	userAddress: "5DJTrWDe5vbs1aB9GWTX93SAz99SkC21KK8L2zfYU6LFpJYJ",
		// 	tradeAssetBalance: 10000,
		// 	coreAssetBalance: 5000,
		// 	userLiquidity: 5000000,
		// };

		// const tradeAssetValue = 5000;
		// const coreAssetValue = 2500;
		// const slippage = 5;

		// const extrinsic = getRemoveLiquidityExtrinsic(
		// 	api,
		// 	userInfo,
		// 	cennzAsset,
		// 	tradeAssetValue,
		// 	cpayAsset,
		// 	coreAssetValue,
		// 	slippage
		// );

		// const [assetId, liquidityAmount, minTradeAmount, minCoreAmount] =
		// 	extrinsic.args;

		// expect(assetId.toJSON()).toBe(cennzAsset.assetId);
		// expect(liquidityAmount.toJSON()).toBe(2500000);
		// expect(minTradeAmount.toJSON()).toBe(tradeAssetValue * (1 - 5 / 100));
		// expect(minCoreAmount.toJSON()).toBe(coreAssetValue * (1 - 5 / 100));
	});
});
