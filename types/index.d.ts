import { ethers } from "ethers";
import { Balance } from "@/utils";
import {
	ButtonHTMLAttributes,
	FormHTMLAttributes,
	HTMLAttributes,
	HTMLFormElement,
	InputHTMLAttributes,
	ReactElement,
} from "react";

//TODO: Remove after Bridge work done
export interface Asset {
	symbol: string;
	assetId?: number;
	decimals?: number;
	logo?: string;
	amount?: number;
	address?: string;
	name?: string;
}

//TODO: Remove after Bridge work done
export interface PoolConfig {
	tradeAsset: CENNZAsset;
	coreAsset: CENNZAsset;
	userPoolShare: IUserShareInPool;
	poolAction: string;
	setOtherAsset: Function;
	setMax: Function;
}

export type SupportedChain = "Ethereum" | "CENNZnet"; //TODO: Remove after Bridge work done
export type BridgeChain = "Ethereum" | "CENNZnet";

//TODO: Remove after Bridge work done
export interface Chain {
	name: SupportedChain;
	logo: string;
}

//TODO: Remove after Bridge work done
export interface CENNZAccount {
	name: string;
	address: string;
}

export type BridgeState = "Deposit" | "Withdraw"; //TODO: Remove after Bridge work done
export type BridgeAction = "Deposit" | "Withdraw";
export type BridgeStatus = "Inactive" | "Active";

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

export interface BridgedEthereumToken extends GenericCoin {
	assetId: CENNZAsset["assetId"];
}

export interface CENNZAssetBalance extends CENNZAsset {
	value: Balance;
}

export type SectionUri = "swap" | "pool" | "bridge";

//TODO: Remove after Bridge work done
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
	input: InputHTMLAttributes<HTMLInputElement>;
}

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

export interface MetaMaskAccount {
	address: string;
}

export interface TxStatus {
	status: "in-progress" | "success" | "fail";
	title: string;
	message: string | ReactElement;
}
