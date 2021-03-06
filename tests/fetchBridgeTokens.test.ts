import fetchBridgeTokens from "@/libs/utils/fetchBridgeTokens";

const api = global.getCENNZApiForTest();

describe("fetchBridgeTokens", () => {
	it("returns expected result on Deposit action", async () => {
		const tokens = await fetchBridgeTokens(api, "Deposit");
		expect(tokens.length).toBeGreaterThan(0);
		tokens.forEach((token) =>
			expect(Object.keys(token)).toEqual([
				"address",
				"symbol",
				"decimals",
				"decimalsValue",
			])
		);
	});

	it("returns expected result on Withdraw action", async () => {
		const tokens = await fetchBridgeTokens(api, "Withdraw");
		expect(tokens.length).toBeGreaterThan(0);
		tokens.forEach((token) =>
			expect(Object.keys(token)).toEqual([
				"assetId",
				"address",
				"symbol",
				"decimals",
				"decimalsValue",
			])
		);
	});
});
