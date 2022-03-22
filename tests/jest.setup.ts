import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";

jest.mock("@/utils/getTokenLogo");
jest.mock("@/constants", () => ({
	CENNZ_ASSET_ID: 16000,
	CPAY_ASSET_ID: 16001,
	ALLOWED_ASSET_IDS: [16000, 16001],
	ETH_CHAIN_ID: 42,
}));

global.getCENNZApiForTest = () => {
	let api: Api = new Api({
		provider: "wss://nikau.centrality.me/public/ws",
	});

	beforeAll(async () => {
		await api.isReady;
	});

	afterAll(async () => {
		await api?.disconnect();
	});

	return api;
};

global.getCENNZCoreAssetsForTest = (): {
	cennzAsset: CENNZAsset;
	cpayAsset: CENNZAsset;
} => {
	return {
		cennzAsset: {
			assetId: 16000,
			symbol: "CENNZ",
			decimals: 4,
			decimalsValue: Math.pow(10, 4),
		},

		cpayAsset: {
			assetId: 16001,
			symbol: "CPAY",
			decimals: 4,
			decimalsValue: Math.pow(10, 4),
		},
	};
};
