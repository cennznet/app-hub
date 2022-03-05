import fetchBridgeTokens from "@/utils/fetchBridgeTokens";
import fetchCENNZAssets from "@/utils/fetchCENNZAssets";
import fetchCENNZAssetBalances from "@/utils/fetchCENNZAssetBalances";
import fetchEthereumTokens from "@/utils/fetchEthereumTokens";
import fetchPoolAssets from "@/utils/fetchPoolAssets";
import fetchSupportedAssets from "@/utils/fetchSupportedAssets";
import fetchSwapAssets from "@/utils/fetchSwapAssets";
import generateGlobalProps from "@/utils/generateGlobalProps";
import getTokenLogo from "@/utils/getTokenLogo";
import fetchSwapExchangeRate from "@/utils/fetchSwapExchangeRate";

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
	fetchSwapExchangeRate,
};
