import { Amount } from "@/utils/Amount";

export interface Asset {
	symbol: string;
	id?: number;
	decimals?: number;
	logo?: string;
	amount?: number;
	address?: string;
	name?: string;
}

export interface BridgeToken {
	chainId: number;
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	logoURI: string;
	id: number;
}

export interface IExchangePool {
	coreAssetBalance: Amount;
	assetBalance: Amount;
	address: string;
	assetId: number;
}

export interface IUserShareInPool {
	coreAssetBalance: Amount;
	assetBalance: Amount;
	liquidity: Amount;
	address: string;
	assetId: number;
}

export interface AssetInfo {
	id: number;
	symbol: string;
	decimals: number;
	logo: string;
}

export interface BalanceInfo {
	id: number;
	symbol: string;
	decimals: number;
	logo: string;
	value: number;
	rawValue: Codec;
	tokenAddress?: string;
}

export interface PoolValues {
	tradeAsset: number | string;
	coreAsset: number | string;
	tradeLiquidity?: number;
	coreLiquidity?: number;
}

export interface PoolSummaryProps {
	tradeAsset: AssetInfo;
	poolLiquidity: PoolValues;
	exchangeRate: number | string;
}

export interface PoolConfig {
	tradeAsset: AssetInfo;
	coreAsset: AssetInfo;
	userPoolShare: IUserShareInPool;
	poolAction: string;
	setOtherAsset: Function;
	setMax: Function;
}

export type SupportedChain = "Ethereum" | "CENNZnet";

export interface Chain {
	name: SupportedChain;
	logo: string;
}

export interface CENNZAccount {
	name: string;
	address: string;
}

export type BridgeState = "Deposit" | "Withdraw";

export interface GenericCoin {
	decimals: number;
	symbol: string;
}

export interface CENNZAsset extends GenericCoin {
	assetId: number;
}

export interface EthereumToken extends GenericCoin {
	address: string;
}

export interface CENNZAssetBalance extends CENNZAsset {
	value: number;
	rawValue: Codec;
}

export type TxModalAttributes = {
	state: string;
	title: string;
	text: string;
	hash: string;
} | null;
