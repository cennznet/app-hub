import { CENNZMetaMaskNetwork } from "@/types";

export const CENNZ_ASSET_ID: number = Number(
	process.env.NEXT_PUBLIC_CENNZ_ASSET_ID
);
export const CPAY_ASSET_ID: number = Number(
	process.env.NEXT_PUBLIC_CPAY_ASSET_ID
);
export const ETH_TOKEN_ADDRESS: string =
	"0x0000000000000000000000000000000000000000";

export const ALLOWED_ASSET_IDS: number[] =
	process.env.NEXT_PUBLIC_ALLOWED_ASSET_IDS.split(",").map(Number);
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL;

export const ETH_CHAIN_ID: number = Number(
	process.env.NEXT_PUBLIC_ETH_CHAIN_ID
);

export const BRIDGE_RELAYER_URL: string =
	process.env.NEXT_PUBLIC_BRIDGE_RELAYER_URL;

export const GA_ID: string = process.env.NEXT_PUBLIC_GA_ID;

export const VERCEL_URL: string = process.env.NEXT_PUBLIC_VERCEL_URL;

export const MAINNET_BRIDGE_CONTRACT: string =
	"0xf7997B93437d5d2AC226f362EBF0573ce7a53930";

export const KOVAN_BRIDGE_CONTRACT: string =
	"0x6484A31Df401792c784cD93aAAb3E933B406DdB3";

export const ROPSTEN_BRIDGE_CONTRACT: string =
	"0x452b8dd7b00D51e48cEF6254a48B7426d44658B8";

export const MAINNET_PEG_CONTRACT: string =
	"0x76BAc85e1E82cd677faa2b3f00C4a2626C4c6E32";

export const KOVAN_PEG_CONTRACT: string =
	"0xa39E871e6e24f2d1Dd6AdA830538aBBE7b30F78F";

export const ROPSTEN_PEG_CONTRACT: string =
	"0x4C411B3Bf36D6DE908C6f4256a72B85E3f2B00bF";

export const CENNZ_EXPLORER_URL: string =
	process.env.NEXT_PUBLIC_CENNZ_EXPLORER_URL;

export const ETH_EXPLORER_URL: string =
	process.env.NEXT_PUBLIC_ETH_EXPLORER_URL;

export const APP_VERSION: string = process.env.APP_VERSION;

export const COMMIT_SHA: string = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;

export const CENNZ_NETWORK: string = process.env.NEXT_PUBLIC_CENNZ_NETWORK;

const CENNZ_METAMASK_NETWORKS = {
	azalea: {
		cennzTokenAddress: "0x5de841521336640695584288fcae37a41a9c92a4",
		chainId: `0x${Number(21337).toString(16)}`,
		chainName: "CENNZnet Azalea",
		explorerUrl: "https://uncoverexplorer.com",
		rpcUrl: "https://cennznet.unfrastructure.io/public",
	},
	nikau: {
		cennzTokenAddress: "0xcCccccCc00003E80000000000000000000000000",
		chainId: `0x${Number(3001).toString(16)}`,
		chainName: "CENNZnet Nikau",
		explorerUrl: "https://nikau.uncoverexplorer.com",
		rpcUrl: "https://nikau.centrality.me/public",
	},
	rata: {
		cennzTokenAddress: "0xcCccccCc00003E80000000000000000000000000",
		chainId: `0x${Number(3000).toString(16)}`,
		chainName: "CENNZnet Rata",
		explorerUrl: "https://rata.uncoverexplorer.com",
		rpcUrl: "https://rata.centrality.me/public",
	},
};

export const CENNZ_METAMASK_NETWORK: CENNZMetaMaskNetwork =
	CENNZ_METAMASK_NETWORKS[CENNZ_NETWORK];

export const CENNZ_IPFS: string =
	"https://gateway.pinata.cloud/ipfs/QmWhNm7tTi6SYbiumULDRk956hxgqaZSX77vcxBNn8fvnw";
