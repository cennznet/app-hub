import fetchPoolUserInfo from "@/libs/utils/fetchPoolUserInfo";
import { Balance } from "@/libs/utils";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();
const testingAddress = "5DJTrWDe5vbs1aB9GWTX93SAz99SkC21KK8L2zfYU6LFpJYJ";

describe("fetchPoolUserInfo", () => {
	it("returns expected results", async () => {
		const { userAddress, userLiquidity, tradeAssetBalance, coreAssetBalance } =
			await fetchPoolUserInfo(api, testingAddress, cennzAsset, cpayAsset);

		expect(userAddress).toBeDefined();
		expect(tradeAssetBalance).toBeInstanceOf(Balance);
		expect(tradeAssetBalance.getSymbol()).toBe(cennzAsset.symbol);
		expect(coreAssetBalance).toBeInstanceOf(Balance);
		expect(coreAssetBalance.getSymbol()).toBe(cpayAsset.symbol);
		expect(userLiquidity).toBeInstanceOf(Balance);
	});
});
