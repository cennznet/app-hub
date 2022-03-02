import fetchBridgeTokens from "@/utils/fetchBridgeTokens";

describe("fetchBridgeTokens", () => {
	it("returns expected result", async () => {
		process.env.NEXT_PUBLIC_ETH_CHAIN_ID = "1";
		const tokens = await fetchBridgeTokens();
		expect(tokens.length).toBeGreaterThan(0);
		tokens.forEach((token) =>
			expect(Object.keys(token)).toEqual(["address", "symbol", "decimals"])
		);
	});
});
