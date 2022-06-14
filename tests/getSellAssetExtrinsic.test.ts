import getSellAssetExtrinsic from "@/libs/utils/getSellAssetExtrinsic";
import { Balance } from "@/libs/utils";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = getCENNZCoreAssetsForTest();

describe("getSellAssetExtrinsic", () => {
	it("defines extrinsic with correct values", async () => {
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
		) as any;

		expect(extrinsic.args[0].toJSON()).toEqual(null);
		expect(extrinsic.args[1].toJSON()).toEqual(cennzAsset.assetId);
		expect(extrinsic.args[2].toJSON()).toEqual(cpayAsset.assetId);
		expect(extrinsic.args[3].toString()).toEqual(exchangeAssetValue.toFixed(0));
		expect(extrinsic.args[4].toString()).toEqual(
			receivedAssetValue.decrease(slippage).toFixed(0)
		);
	});
});
