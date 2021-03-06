import fetchGasFee from "@/libs/utils/fetchGasFee";
import getSellAssetExtrinsic from "@/libs/utils/getSellAssetExtrinsic";
import { Balance } from "@/libs/utils";
import { SubmittableExtrinsic } from "@/libs/types";

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
