export { default as fetchBridgeTokens } from "@/utils/fetchBridgeTokens";
export { default as fetchCENNZAssets } from "@/utils/fetchCENNZAssets";
export { default as fetchCENNZAssetBalances } from "@/utils/fetchCENNZAssetBalances";
export { default as fetchEthereumTokens } from "@/utils/fetchEthereumTokens";
export { default as fetchPoolAssets } from "@/utils/fetchPoolAssets";
export { default as fetchSwapAssets } from "@/utils/fetchSwapAssets";
export { default as generateGlobalProps } from "@/utils/generateGlobalProps";
export { default as getTokenLogo } from "@/utils/getTokenLogo";
export { default as fetchSellPrice } from "@/utils/fetchSellPrice";
export { default as fetchGasFee } from "@/utils/fetchGasFee";
export { default as getBuyAssetExtrinsic } from "@/utils/getBuyAssetExtrinsic";

export const formatBalance = (balance: number): string => {
	if (balance === 0 || !balance) return "0.0000";
	return balance < 0.0001 ? "<0.0001" : balance.toFixed(4);
};
