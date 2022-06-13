import { Balance } from "@/libs/utils";
import fetchPoolExchangeInfo from "@/libs/utils/fetchPoolExchangeInfo";

const api = global.getCENNZApiForTest();

const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();

describe("fetchPoolExchangeInfo", () => {
	it("returns expected results", async () => {
		const {
			exchangeAddress,
			tradeAssetReserve,
			coreAssetReserve,
			exchangeLiquidity,
		} = await fetchPoolExchangeInfo(api, cennzAsset, cpayAsset);

		expect(exchangeAddress).toBeDefined();
		expect(tradeAssetReserve).toBeInstanceOf(Balance);
		expect(tradeAssetReserve.getSymbol()).toBe(cennzAsset.symbol);
		expect(coreAssetReserve).toBeInstanceOf(Balance);
		expect(coreAssetReserve.getSymbol()).toBe(cpayAsset.symbol);
		expect(exchangeLiquidity).toBeInstanceOf(Balance);
	});
});
