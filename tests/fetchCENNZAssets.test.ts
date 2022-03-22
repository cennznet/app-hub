import fetchCENNZAssets from "@/utils/fetchCENNZAssets";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();

describe("fetchCENNZAssets", () => {
	it("returns expected result", async () => {
		const assets = await fetchCENNZAssets(api);
		assets.forEach((asset) => {
			const { assetId, symbol } = asset;
			expect(Object.keys(asset)).toEqual([
				"assetId",
				"symbol",
				"decimals",
				"decimalsValue",
			]);
			expect(!!assetId).toEqual(true);
			expect(!!symbol).toEqual(true);

			expect(assets[0]).toEqual(cennzAsset);
			expect(assets[1]).toEqual(cpayAsset);
		});
	});
});
