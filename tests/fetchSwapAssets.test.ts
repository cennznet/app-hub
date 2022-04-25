import { Api } from "@cennznet/api";
import fetchSwapAssets from "@/utils/fetchSwapAssets";

const api: Api = global.getCENNZApiForTest();

describe("fetchSwapAssets", () => {
	it("returns expected result", async () => {
		const assets = await fetchSwapAssets(api);

		const cpay = assets.find(({ symbol }) => symbol === "CPAY");
		expect(cpay).toBeDefined();

		assets
			.filter(({ symbol }) => symbol !== "CPAY")
			.forEach(async ({ assetId }) => {
				const totalLiquidity = await api.derive.cennzx.totalLiquidity(assetId);
				expect(totalLiquidity.toNumber() > 0).toBe(true);
			});
	});
});
