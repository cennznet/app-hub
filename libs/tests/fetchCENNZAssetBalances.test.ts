import fetchCENNZAssetBalances from "@utils/fetchCENNZAssetBalances";
import { u128 } from "@polkadot/types-codec";

const testingAccount = global.getCENNZTestingAccount();

const api = global.getCENNZApiForTest();

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
