export const CENNZ_ASSET_ID: number = Number(
	process.env.NEXT_PUBLIC_CENNZ_ASSET_ID
);
export const CPAY_ASSET_ID: number = Number(
	process.env.NEXT_PUBLIC_CPAY_ASSET_ID
);

export const ALLOWED_ASSET_IDS: number[] =
	process.env.NEXT_PUBLIC_ALLOWED_ASSET_IDS.split(",").map(Number);

export const GA_ID: string = process.env.NEXT_PUBLIC_GA_ID;

export const APP_VERSION: string = process.env.APP_VERSION;
export const COMMIT_SHA: string = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;
export const VERCEL_URL: string = process.env.NEXT_PUBLIC_VERCEL_URL;

export const ETH_TOKEN_ADDRESS: string =
	"0x0000000000000000000000000000000000000000";

export const CENNZ_NETWORK = {
	rata: {
		ChainName: "Rata Testnet",
		ChainId: {
			InDec: 3000,
			InHex: `0x${Number(3000).toString(16)}`,
		},
		ApiUrl: {
			InWebSocket: "wss://rata.centrality.me/public/ws",
		},
		ExplorerUrl: "https://rata.uncoverexplorer.com",
		ClaimRelayerUrl: "https://bridge-contracts.rata.centrality.me",
		LinkedEthChain: "ropsten",
		StakingAssetId: 16000,
		SpendingAssetId: 16001,
	},

	nikau: {
		ChainName: "Nikau Testnet",
		ChainId: {
			InDec: 3001,
			InHex: `0x${Number(3001).toString(16)}`,
		},
		ApiUrl: {
			InWebSocket: "wss://nikau.centrality.me/public/ws",
		},
		ExplorerUrl: "https://nikau.uncoverexplorer.com",
		ClaimRelayerUrl: "https://bridge-contracts.nikau.centrality.me",
		LinkedEthChain: "kovan",
		StakingAssetId: 16000,
		SpendingAssetId: 16001,
	},

	azalea: {
		ChainName: "CENNZnet Mainnet",
		ChainId: {
			InDec: 21337,
			InHex: `0x${Number(21337).toString(16)}`,
		},
		ApiUrl: {
			InWebSocket: "wss://cennznet.unfrastructure.io/public/ws",
		},
		ExplorerUrl: "https://uncoverexplorer.com",
		ClaimRelayerUrl: "https://bridge-contracts.centralityapp.com",
		LinkedEthChain: "mainnet",
		StakingAssetId: 1,
		SpendingAssetId: 2,
	},
}[process.env.NEXT_PUBLIC_CENNZ_NETWORK ?? "rata"];

export const ETHEREUM_NETWORK = {
	ropsten: {
		ChainName: "Ropsten Testnet",
		ChainId: {
			InDec: 3,
			InHex: `0x${Number(3).toString(16)}`,
		},
		ExplorerUrl: "https://ropsten.etherscan.io",
		BridgeAddress: "0x452b8dd7b00D51e48cEF6254a48B7426d44658B8",
		PegAddress: "0x4C411B3Bf36D6DE908C6f4256a72B85E3f2B00bF",
	},
	kovan: {
		ChainName: "Kovan Testnet",
		ChainId: {
			InDec: 42,
			InHex: `0x${Number(42).toString(16)}`,
		},
		ExplorerUrl: "https://kovan.etherscan.io",
		BridgeAddress: "0x6484A31Df401792c784cD93aAAb3E933B406DdB3",
		PegAddress: "0xa39E871e6e24f2d1Dd6AdA830538aBBE7b30F78F",
	},

	mainnet: {
		ChainName: "Ethereum Mainnet",
		ChainId: {
			InDec: 1,
			InHex: `0x${Number(1).toString(16)}`,
		},
		ExplorerUrl: "https://etherscan.io",
		BridgeAddress: "0xf7997B93437d5d2AC226f362EBF0573ce7a53930",
		PegAddress: "0x76BAc85e1E82cd677faa2b3f00C4a2626C4c6E32",
	},
}[process.env.NEXT_PUBLIC_ETHEREUM_NETWORK ?? CENNZ_NETWORK.LinkedEthChain];

export const ENABLE_TRANSFERS_TAB =
	process.env.NEXT_PUBLIC_ENABLE_TRANSFERS_TAB === "1";
