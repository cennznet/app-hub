import { Api } from "@cennznet/api";
import fetchSupportedAssets from "@/utils/fetchSupportedAssets";

describe("fetchSupportedAssets", () => {
	let api: Api;
	beforeAll(async () => {
		jest.setTimeout(10000);
		api = await Api.create({ provider: "wss://nikau.centrality.me/public/ws" });
	});

	afterAll(async () => {
		await api.disconnect();
	});

	it("returns list of assets with their infos", async () => {
		const assetIds = [16000, 16001, 17002];
		const assets = await fetchSupportedAssets(api, assetIds);

		assets.forEach((asset, index) => {
			expect(asset.id).toStrictEqual(assetIds[index]);
			expect(asset.logo).toStrictEqual(
				`images/${asset.symbol.toLowerCase()}.svg`
			);
		});
	});

	it("throws error if any of requested `assetId` doesn not exist", async () => {
		const assetIds = [10000];
		await expect(fetchSupportedAssets(api, assetIds)).rejects.toThrow(
			'Asset id "10000" not found'
		);
	});
});
