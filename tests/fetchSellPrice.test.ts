import fetchSellPrice from "@/utils/fetchSellPrice";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();

describe("fetchSellPrice", () => {
	it("returns expected result CENNZ -> CPAY", async () => {
		const sellPrice = await fetchSellPrice(api, "1", cennzAsset, cpayAsset);

		expect(sellPrice).toBeGreaterThan(0);
	});

	it("returns expected result CPAY -> CENNZ", async () => {
		const sellPrice = await fetchSellPrice(api, "1", cpayAsset, cennzAsset);

		expect(sellPrice).toBeGreaterThan(0);
	});
});
