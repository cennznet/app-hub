import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";

jest.mock("@/utils/getTokenLogo");

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

global.getCENNZCoreAssetForTest = (): {
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
			assetId: 16000,
			symbol: "CENNZ",
			decimals: 4,
			decimalsValue: Math.pow(10, 4),
		},
	};
};
