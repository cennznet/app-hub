import fetchEthereumTokens from "@utils/fetchEthereumTokens";

describe("fetchCENNZnetAssets", () => {
	it("returns expected result", () => {
		const tokens = fetchEthereumTokens(1);
		tokens.forEach((token) => {
			expect(Object.keys(token)).toEqual([
				"address",
				"symbol",
				"decimals",
				"decimalsValue",
			]);
		});
	});
});
