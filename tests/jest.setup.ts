import { Api } from "@cennznet/api";
import { BridgedEthereumToken, CENNZAsset } from "@/types";
import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

jest.mock("@/utils/getTokenLogo");
jest.mock("@/constants", () => ({
	CENNZ_ASSET_ID: 16000,
	CPAY_ASSET_ID: 16001,
	ALLOWED_ASSET_IDS: [16000, 16001],
	ETH_CHAIN_ID: 42,
	KOVAN_PEG_CONTRACT: "0xa39E871e6e24f2d1Dd6AdA830538aBBE7b30F78F",
	ETH_TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000",
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
} => ({
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
});

global.getEthereumAssetsForTest = (): {
	cennzAsset: BridgedEthereumToken;
	ethAsset: BridgedEthereumToken;
} => ({
	cennzAsset: {
		assetId: 16000,
		address: "0xb7e26f93211932865430a03236dd043f7248993b",
		symbol: "CENNZ",
		decimals: 4,
		decimalsValue: 10000,
	},
	ethAsset: {
		assetId: 17002,
		address: "0x0000000000000000000000000000000000000000",
		symbol: "ETH",
		decimals: 18,
		decimalsValue: 1000000000000000000,
	},
});
