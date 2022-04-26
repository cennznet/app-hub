import getSellAssetExtrinsic from "@/utils/getSellAssetExtrinsic";
import { Balance } from "@/utils";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = getCENNZCoreAssetsForTest();

describe("getSellAssetExtrinsic", () => {
	it("returns expected extrinsic", async () => {
		const exchangeAssetValue = new Balance(10, cennzAsset);
		const receivedAssetValue = new Balance(5, cpayAsset);
		const slippage = 5;

		const extrinsic = getSellAssetExtrinsic(
			api,
			cennzAsset.assetId,
			exchangeAssetValue,
			cpayAsset.assetId,
			receivedAssetValue,
			slippage
		);

		const expected = api.tx.cennzx.sellAsset(
			null,
			cennzAsset.assetId,
			cpayAsset.assetId,
			exchangeAssetValue.toFixed(0),
			receivedAssetValue.decrease(slippage).toFixed(0)
		);

		expect(extrinsic).toEqual(expected);
	});
});
