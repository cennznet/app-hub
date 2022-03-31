import fetchGasFee from "@/utils/fetchGasFee";
import getBuyAssetExtrinsic from "@/utils/getBuyAssetExtrinsic";
import { Balance } from "@/utils";

const api = global.getCENNZApiForTest();

const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();

describe("fetchGasFee", () => {
	it("returns expected result", async () => {
		const gasFee = await fetchGasFee(
			api,
			getBuyAssetExtrinsic(
				api,
				cennzAsset.assetId,
				Balance.fromInput("1", cennzAsset),
				cpayAsset.assetId,
				Balance.fromInput("1", cpayAsset),
				5
			),
			cpayAsset
		);

		expect(gasFee.gt(0)).toBe(true);
	});
});
