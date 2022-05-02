import getBuyAssetExtrinsic from "@/utils/getBuyAssetExtrinsic";
import { Balance } from "@/utils";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = getCENNZCoreAssetsForTest();

describe("getBuyAssetExtrinsic", () => {
	it("defines extrinsic with correct values", async () => {
		const exchangeAssetValue = new Balance(10, cennzAsset);
		const receivedAssetValue = new Balance(5, cpayAsset);
		const slippage = 5;

		const extrinsic = getBuyAssetExtrinsic(
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
		expect(extrinsic.args[3].toString()).toEqual(receivedAssetValue.toFixed(0));
		expect(extrinsic.args[4].toString()).toEqual(
			exchangeAssetValue.increase(slippage).toFixed(0)
		);
	});
});
