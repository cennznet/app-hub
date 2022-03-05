import fetchBridgeTokens from "./fetchBridgeTokens";
import fetchCENNZAssets from "./fetchCENNZAssets";
import fetchCENNZAssetBalances from "./fetchCENNZAssetBalances";
import fetchEthereumTokens from "./fetchEthereumTokens";
import fetchPoolAssets from "./fetchPoolAssets";
import fetchSupportedAssets from "./fetchSupportedAssets";
import fetchSwapAssets from "./fetchSwapAssets";
import generateGlobalProps from "./generateGlobalProps";
import getTokenLogo from "./getTokenLogo";

export const formatBalance = (balance: number): string => {
	if (balance === 0 || !balance) return "0.0000";
	return balance < 0.0001 ? "<0.0001" : balance.toFixed(4);
};

export {
	generateGlobalProps,
	fetchCENNZAssets,
	fetchSupportedAssets,
	fetchPoolAssets,
	fetchCENNZAssetBalances,
	fetchBridgeTokens,
	fetchEthereumTokens,
	fetchSwapAssets,
	getTokenLogo,
};
