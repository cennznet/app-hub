import fetchGasFee from "@/utils/fetchGasFee";
import getBuyAssetExtrinsic from "@/utils/getBuyAssetExtrinsic";

const api = global.getCENNZApiForTest();

const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();

describe("fetchGasFee", () => {
	it("returns expected result", async () => {
		const gasFee = await fetchGasFee(
			api,
			getBuyAssetExtrinsic(api, cennzAsset, 1, cpayAsset, 1, 5),
			cpayAsset
		);

		expect(gasFee).toBeGreaterThan(0);
	});
});
