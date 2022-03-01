import { Api } from "@cennznet/api";
import fetchCENNZnetAssets from "@/utils/fetchCENNZnetAssets";

let api: Api;
beforeAll(async () => {
	api = await Api.create({ provider: "wss://nikau.centrality.me/public/ws" });
});

afterAll(async () => {
	await api.disconnect();
});

describe("fetchCENNZnetAssets", () => {
	it("returns expected result", async () => {
		const assets = await fetchCENNZnetAssets(api);
		assets.forEach((asset) => {
			const { assetId, symbol } = asset;
			expect(Object.keys(asset)).toEqual(["assetId", "symbol", "decimals"]);
			expect(!!assetId).toEqual(true);
			expect(!!symbol).toEqual(true);
		});
	});
});
