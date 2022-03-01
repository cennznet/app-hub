import { Api } from "@cennznet/api";
import fetchCENNZAssetBalances from "@/utils/fetchCENNZAssetBalances";

const testingAccount = "5FbMzsoEpd2mt8eyKpKUxwJ5S9W7nJVJkCer2Jk7tvSpB1vF";

let api: Api;
beforeAll(async () => {
	api = await Api.create({ provider: "wss://nikau.centrality.me/public/ws" });
});

afterAll(async () => {
	await api.disconnect();
});

describe("fetchAssetBalances", () => {
	it("returns correct values", async () => {
		const balances = await fetchCENNZAssetBalances(api, testingAccount);

		balances.forEach(async (balance) => {
			const expectedBalance = await api.query.genericAsset.freeBalance(
				balance.assetId,
				testingAccount
			);
			expect(balance.rawValue).toEqual(expectedBalance);
		});
	});
});
