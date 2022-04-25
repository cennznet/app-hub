import { Api } from "@cennznet/api";
import fetchCENNZAssetBalances from "@/utils/fetchCENNZAssetBalances";
import { u128 } from "@polkadot/types-codec";

const testingAccount = "5FbMzsoEpd2mt8eyKpKUxwJ5S9W7nJVJkCer2Jk7tvSpB1vF";

const api: Api = global.getCENNZApiForTest();

describe("fetchAssetBalances", () => {
	it("returns correct values", async () => {
		const balances = await fetchCENNZAssetBalances(api, testingAccount);

		balances.forEach((balance) => {
			const expectedBalance: u128 = void api.query.genericAsset.freeBalance(
				balance.assetId,
				testingAccount
			);
			expect(balance.rawValue).toEqual(expectedBalance);
		});
	});
});
