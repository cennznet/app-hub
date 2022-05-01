import getPegWithdrawExtrinsic from "@/utils/getPegWithdrawExtrinsic";
import { Balance } from "@/utils";

const api = global.getCENNZApiForTest();
const { cennzAsset } = global.getCENNZCoreAssetsForTest();
const testingAccount = global.getEthereumTestingAccount();

describe("getPegWithdrawExtrinsic", () => {
	it("defines extrinsic with correct values", () => {
		const transferAssetValue = new Balance(10, cennzAsset);
		const extrinsic = getPegWithdrawExtrinsic(
			api,
			cennzAsset.assetId,
			transferAssetValue,
			testingAccount
		) as any;

		expect(extrinsic.args[0].toJSON()).toEqual(cennzAsset.assetId);
		expect(extrinsic.args[1].toString()).toEqual(transferAssetValue.toFixed(0));
		expect(extrinsic.args[2].toJSON()).toEqual(testingAccount.toLowerCase());
	});
});
