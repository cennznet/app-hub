import { Api } from "@cennznet/api";
import { BridgedEthereumToken, CENNZAsset } from "@/libs/types";
import { mock } from "@depay/web3-mock";
import { enableFetchMocks } from "jest-fetch-mock";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

enableFetchMocks();

jest.mock("@/libs/utils/getTokenLogo");
jest.mock("@/libs/utils/CENNZTransaction");
jest.mock("@/libs/utils/EthereumTransaction");

global.getCENNZTestingAccount = () =>
	"5FbMzsoEpd2mt8eyKpKUxwJ5S9W7nJVJkCer2Jk7tvSpB1vF";
global.getEthereumTestingAccount = () =>
	"0x699aC2aedF058e76eD900FCc8cB31aB316B35bF2";

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
