import { Api } from "@cennznet/api";
import { fetchAssetBalances } from "@/utils/fetchAssetBalances";
import fetchSupportedAssets from "@/utils/fetchSupportedAssets";

const testingAccount = "5FbMzsoEpd2mt8eyKpKUxwJ5S9W7nJVJkCer2Jk7tvSpB1vF";

let api: Api;
beforeAll(async () => {
	jest.setTimeout(10000);
	api = await Api.create({ provider: "wss://nikau.centrality.me/public/ws" });
});

afterAll(async () => {
	await api.disconnect();
});

describe("fetchAssetBalances", () => {
	it("returns correct values", async () => {
		const assetIds = [16000, 16001, 17001, 17002, 17003];
		const assets = await fetchSupportedAssets(api, assetIds);
		const balances = await fetchAssetBalances(api, assets, testingAccount);

		balances.forEach(async (balance) => {
			const expectedBalance = await api.query.genericAsset.freeBalance(
				balance.id,
				testingAccount
			);
			let expectedTokenAddress: any = await api.query.erc20Peg.assetIdToErc20(
				balance.id
			);
			expectedTokenAddress = expectedTokenAddress.toJSON();

			expect(balance.rawValue).toEqual(expectedBalance);
			expect(balance.tokenAddress).toEqual(expectedTokenAddress);
		});
	});
});
