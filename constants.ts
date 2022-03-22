export const CENNZ_ASSET_ID: number = Number(
	process.env.NEXT_PUBLIC_CENNZ_ASSET_ID
);
export const CPAY_ASSET_ID: number = Number(
	process.env.NEXT_PUBLIC_CPAY_ASSET_ID
);
export const ALLOWED_ASSET_IDS: number[] =
	process.env.NEXT_PUBLIC_ALLOWED_ASSET_IDS.split(",").map(Number);
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL;

export const ETH_CHAIN_ID: number = Number(
	process.env.NEXT_PUBLIC_ETH_CHAIN_ID
);
