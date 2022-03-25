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
export { default as signAndSendTx } from "@/utils/signAndSendTx";
export { default as fetchPoolExchangeInfo } from "@/utils/fetchPoolExchangeInfo";
export { default as fetchPoolUserInfo } from "@/utils/fetchPoolUserInfo";
export { default as getAddLiquidityExtrinsic } from "@/utils/getAddLiquidityExtrinsic";
export { default as getRemoveLiquidityExtrinsic } from "@/utils/getRemoveLiquidityExtrinsic";
export { default as Balance } from "@/utils/Balance";
export { default as ensureEthereumChain } from "@/utils/ensureEthereumChain";
export { default as fetchMetaMaskBalance } from "@/utils/fetchMetaMaskBalance";
export {
	default as fetchBridgeDepositStatus,
	ensureBridgeDepositActive,
} from "@/utils/fetchBridgeDepositStatus";
export {
	default as fetchBridgeWithdrawStatus,
	ensureBridgeWithdrawActive,
} from "@/utils/fetchBridgeWithdrawStatus";
export { default as getERC20PegContract } from "@/utils/getERC20PegContract";
export { default as getBridgeContract } from "@/utils/getBridgeContract";
export { default as getERC20TokenContract } from "@/utils/getERC20TokenContract";
export { default as sendDepositRequest } from "@/utils/sendDepositRequest";
export { default as getPegWithdrawExtrinsic } from "@/utils/getPegWithdrawExtrinsic";
export { default as sendWithdrawCENNZRequest } from "@/utils/sendWithdrawCENNZRequest";
export { default as waitUntil } from "@/utils/waitUntil";

//TODO: Remove after Bridge work done
export const formatBalance = (balance: number): string => {
	if (balance === 0 || !balance) return "0.0000";
	return balance < 0.0001 ? "<0.0001" : balance.toFixed(4);
};
