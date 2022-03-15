import fetchPoolUserBalances from "@/utils/fetchPoolUserBalances";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();
const testingAddress = "5DJTrWDe5vbs1aB9GWTX93SAz99SkC21KK8L2zfYU6LFpJYJ";

describe("fetchPoolUserBalances", () => {
	it("returns expected results", async () => {
		const balances = await fetchPoolUserBalances(
			api,
			testingAddress,
			cennzAsset,
			cpayAsset
		);

		expect(typeof balances.coreBalance).toBe("number");
		expect(typeof balances.tradeBalance).toBe("number");
	});
});
