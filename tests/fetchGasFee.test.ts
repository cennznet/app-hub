import fetchGasFee from "@/utils/fetchGasFee";
import getSellAssetExtrinsic from "@/utils/getSellAssetExtrinsic";
import { Balance } from "@/utils";
import { SubmittableExtrinsic } from "@/types";

const api = global.getCENNZApiForTest();

const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();

describe("fetchGasFee", () => {
	it("returns expected result", async () => {
		const gasFee = await fetchGasFee(
			api,
			getSellAssetExtrinsic(
				api,
				cennzAsset.assetId,
				Balance.fromInput("1", cennzAsset),
				cpayAsset.assetId,
				Balance.fromInput("1", cpayAsset),
				5
			) as SubmittableExtrinsic<"promise">,
			cpayAsset
		);

		expect(gasFee.gt(0)).toBe(true);
	});
});
