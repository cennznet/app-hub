import getAddLiquidityExtrinsic from "@/utils/getAddLiquidityExtrinsic";
import { Balance, fetchPoolExchangeInfo } from "@/utils";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = getCENNZCoreAssetsForTest();

describe("getAddLiquidityExtrinsic", () => {
  it("returns expected extrinsic", async () => {
    const exchangeInfo = await fetchPoolExchangeInfo(
      api,
      cennzAsset,
      cpayAsset
    );

    const coreAssetValue = new Balance(10, cpayAsset)
    const tradeAssetValue = new Balance(10, cennzAsset)
    const slippage = 5

    const extrinsic = await getAddLiquidityExtrinsic(
      api,
      exchangeInfo,
      cennzAsset.assetId,
      tradeAssetValue,
      coreAssetValue,
      slippage
    );

    const { coreAssetReserve, exchangeLiquidity } = exchangeInfo;
    const minLiquidity = coreAssetReserve.gt(0)
      ? coreAssetValue
        .mul(exchangeLiquidity)
        .div(coreAssetReserve)
        .decrease(slippage)
      : coreAssetValue;
    const maxTradeAmount = tradeAssetValue.increase(slippage);

    const expected = api.tx.cennzx.addLiquidity(
      cennzAsset.assetId,
      minLiquidity.toFixed(0),
      maxTradeAmount.toFixed(0),
      coreAssetValue.toFixed(0)
    );

    expect(extrinsic).toEqual(expected)
  });
});
