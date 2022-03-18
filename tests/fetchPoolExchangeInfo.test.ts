import fetchPoolExchangeInfo from "@/utils/fetchPoolExchangeInfo";

const api = global.getCENNZApiForTest();

const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();

describe("fetchPoolExchangeInfo", () => {
	it("returns expected results", async () => {
		const info = await fetchPoolExchangeInfo(api, cennzAsset, cpayAsset);

		expect(typeof info.poolAddress).toBe("string");
		expect(typeof info.tradeAssetReserve).toBe("number");
		expect(typeof info.coreAssetReserve).toBe("number");
		expect(typeof info.poolLiquidity).toBe("number");
	});
});
