import { Balance } from "@/libs/utils";
import fetchSellPrice from "@/libs/utils/fetchSellPrice";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();

describe("fetchSellPrice", () => {
	it("returns expected result CENNZ -> CPAY", async () => {
		const sellPrice = await fetchSellPrice(
			api,
			cennzAsset.assetId,
			Balance.fromInput("1", cennzAsset),
			cpayAsset
		);

		expect(sellPrice.gt(0)).toBe(true);
	});

	it("returns expected result CPAY -> CENNZ", async () => {
		const sellPrice = await fetchSellPrice(
			api,
			cpayAsset.assetId,
			Balance.fromInput("1", cpayAsset),
			cennzAsset
		);

		expect(sellPrice.gt(0)).toBe(true);
	});
});
