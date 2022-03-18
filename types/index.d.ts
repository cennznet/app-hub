import { Amount } from "@/utils/Amount";
import { Balance } from "@/utils";
import {
	ButtonHTMLAttributes,
	FormHTMLAttributes,
	HTMLAttributes,
	HTMLFormElement,
} from "react";

export interface Asset {
	symbol: string;
	assetId?: number;
	decimals?: number;
	logo?: string;
	amount?: number;
	address?: string;
	name?: string;
}

// export interface IExchangePool {
// 	coreAssetBalance: Amount;
// 	assetBalance: Amount;
// 	address: string;
// 	assetId: number;
// }

// export interface IUserShareInPool {
// 	coreAssetBalance: Amount;
// 	assetBalance: Amount;
// 	liquidity: Amount;
// 	address: string;
// 	assetId: number;
// }

// export interface AssetInfo {
// 	id: number;
// 	symbol: string;
// 	decimals: number;
// 	logo: string;
// }

// export interface BalanceInfo {
// 	id: number;
// 	symbol: string;
// 	decimals: number;
// 	logo: string;
// 	value: number;
// 	rawValue: Codec;
// 	tokenAddress?: string;
// }

// export interface PoolValues {
// 	tradeAsset: number | string;
// 	coreAsset: number | string;
// 	tradeLiquidity?: number;
// 	coreLiquidity?: number;
// }

// export interface PoolSummaryProps {
// 	tradeAsset: CENNZAsset;
// 	poolLiquidity: PoolValues;
// 	exchangeRate: number | string;
// }

// export interface PoolConfig {
// 	tradeAsset: CENNZAsset;
// 	coreAsset: CENNZAsset;
// 	userPoolShare: IUserShareInPool;
// 	poolAction: string;
// 	setOtherAsset: Function;
// 	setMax: Function;
// }

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
	decimalsValue: number;
	symbol: string;
}

export interface CENNZAsset extends GenericCoin {
	assetId: number;
}

export interface EthereumToken extends GenericCoin {
	address: string;
}

export interface CENNZAssetBalance extends CENNZAsset {
	value: Balance;
}

export type SectionUri = "swap" | "pool" | "bridge";

export interface TxModalAttributes {
	state: string;
	title: string;
	text: string;
	hash: string;
}

export interface IntrinsicElements {
	div: HTMLAttributes<HTMLDivElement>;
	form: FormHTMLAttributes<HTMLFormElement>;
	button: ButtonHTMLAttributes<HTMLButtonElement>;
}

export type UnwrapPromise<T> = T extends Promise<infer U>
	? U
	: T extends (...args: any) => Promise<infer U>
	? U
	: T extends (...args: any) => infer U
	? U
	: T;

export type PoolAction = "Add" | "Remove";

export interface PoolExchangeInfo {
	exchangeAddress: string;
	exchangeLiquidity: Balance;
	tradeAssetReserve: Balance;
	coreAssetReserve: Balance;
}

export interface PoolUserInfo {
	userAddress: string;
	userLiquidity: Balance;
	tradeAssetBalance: Balance;
	coreAssetBalance: Balance;
}
