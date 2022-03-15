import fetchPoolExchangeInfo from "@/utils/fetchPoolExchangeInfo";

const api = global.getCENNZApiForTest();

const { cennzAsset } = global.getCENNZCoreAssetsForTest();

describe("fetchPoolExchangeInfo", () => {
	it("returns expected results", async () => {
		const info = await fetchPoolExchangeInfo(api, cennzAsset.assetId);

		expect(typeof info.exchangeAddress).toBe("string");
		expect(typeof info.tradeAssetBalance).toBe("number");
		expect(typeof info.coreAssetBalance).toBe("number");
	});
});
