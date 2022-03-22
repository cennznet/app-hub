import { Api } from "@cennznet/api";
import fetchPoolAssets from "@/utils/fetchPoolAssets";

let api: Api;
beforeAll(async () => {
	api = await Api.create({ provider: "wss://nikau.centrality.me/public/ws" });
});

afterAll(async () => {
	await api.disconnect();
});

describe("fetchPoolAssets", () => {
	it("returns expected result", async () => {
		const assets = await fetchPoolAssets(api);

		const cpay = assets.find(({ symbol }) => symbol === "CPAY");
		const cennz = assets.find(({ symbol }) => symbol === "CENNZ");
		expect(cpay).toBeDefined();
		expect(cennz).toBeDefined();
	});
});
