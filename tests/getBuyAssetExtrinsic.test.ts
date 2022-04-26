import getBuyAssetExtrinsic from "@/utils/getBuyAssetExtrinsic"
import { Balance } from "@/utils";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = getCENNZCoreAssetsForTest();

describe("getBuyAssetExtrinsic", () => {
  it("returns expected extrinsic", async () => {
    const exchangeAssetValue = new Balance(10, cennzAsset)
    const receivedAssetValue = new Balance(5, cpayAsset)
    const slippage = 5

    const extrinsic = getBuyAssetExtrinsic(
      api,
      cennzAsset.assetId,
      exchangeAssetValue,
      cpayAsset.assetId,
      receivedAssetValue,
      slippage
    )

    const expected = api.tx.cennzx.buyAsset(
      null,
      cennzAsset.assetId,
      cpayAsset.assetId,
      receivedAssetValue.toFixed(0),
      exchangeAssetValue.decrease(slippage).toFixed(0)
    );

    expect(extrinsic).toEqual(expected)
  })
})