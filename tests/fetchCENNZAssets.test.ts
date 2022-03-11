import { Api } from "@cennznet/api";
import fetchCENNZAssets from "@/utils/fetchCENNZAssets";

let api: Api;
beforeAll(async () => {
	api = await Api.create({ provider: "wss://nikau.centrality.me/public/ws" });
});

afterAll(async () => {
	await api.disconnect();
});

describe("fetchCENNZnetAssets", () => {
	it("returns expected result", async () => {
		const assets = await fetchCENNZAssets(api);
		assets.forEach((asset) => {
			const { assetId, symbol } = asset;
			expect(Object.keys(asset)).toEqual([
				"assetId",
				"symbol",
				"decimals",
				"decimalsValue",
			]);
			expect(!!assetId).toEqual(true);
			expect(!!symbol).toEqual(true);
		});
	});
});
