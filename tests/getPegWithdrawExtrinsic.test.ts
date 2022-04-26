import getPegWithdrawExtrinsic from "@/utils/getPegWithdrawExtrinsic";
import { Balance } from "@/utils";

const api = global.getCENNZApiForTest();
const { cennzAsset } = global.getCENNZCoreAssetsForTest();
const testingAccount = global.getEthereumTestingAccount();

describe("getPegWithdrawExtrinsic", () => {
  it("returns expected extrinsic", () => {
    const transferAssetValue = new Balance(10, cennzAsset);
    const extrinsic = getPegWithdrawExtrinsic(api, cennzAsset.assetId, transferAssetValue, testingAccount);

    const expected = api.tx.erc20Peg.withdraw(
      cennzAsset.assetId,
      transferAssetValue.toFixed(0),
      testingAccount
    )

    expect(extrinsic).toEqual(expected)
  });
});