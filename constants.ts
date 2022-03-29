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
