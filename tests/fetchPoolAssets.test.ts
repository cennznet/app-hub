import { Api } from "@cennznet/api";
import fetchPoolAssets from "@/utils/fetchPoolAssets";

const api: Api = global.getCENNZApiForTest();

describe("fetchPoolAssets", () => {
	it("returns expected result", async () => {
		const assets = await fetchPoolAssets(api);

		const cpay = assets.find(({ symbol }) => symbol === "CPAY");
		const cennz = assets.find(({ symbol }) => symbol === "CENNZ");
		expect(cpay).toBeDefined();
		expect(cennz).toBeDefined();
	});
});
