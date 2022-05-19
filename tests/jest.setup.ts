import { Api } from "@cennznet/api";
import { BridgedEthereumToken, CENNZAsset } from "@/types";
import { mock } from "@depay/web3-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

enableFetchMocks();

jest.mock("@/utils/getTokenLogo");
jest.mock("@/utils/CENNZTransaction");
jest.mock("@/utils/EthereumTransaction");
jest.mock("@/constants", () => ({
	CENNZ_ASSET_ID: 16000,
	CPAY_ASSET_ID: 16001,
	ALLOWED_ASSET_IDS: [16000, 16001],
	ETH_CHAIN_ID: 3,
	ROPSTEN_PEG_CONTRACT: "0x4C411B3Bf36D6DE908C6f4256a72B85E3f2B00bF",
	ETH_TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000",
	ROPSTEN_BRIDGE_CONTRACT: "0x452b8dd7b00D51e48cEF6254a48B7426d44658B8",
}));

global.getCENNZTestingAccount = () =>
	"5FbMzsoEpd2mt8eyKpKUxwJ5S9W7nJVJkCer2Jk7tvSpB1vF";
global.getEthereumTestingAccount = () =>
	"0x699aC2aedF058e76eD900FCc8cB31aB316B35bF2";

global.getCENNZApiForTest = () => {
	let api: Api = new Api({
		provider: "wss://rata.centrality.me/public/ws",
	});

	beforeAll(async () => {
		await api.isReady;
	});

	afterAll(async () => {
		await api?.disconnect();
	});

	return api;
};

global.getWeb3MockForTest = (): {
	blockchain: string;
	provider: Web3Provider;
	mock: mock;
} => {
	const blockchain = "ethereum";
	mock({
		blockchain,
	});
	const provider = new ethers.providers.Web3Provider(global.ethereum);

	return {
		blockchain,
		provider,
		mock,
	};
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
