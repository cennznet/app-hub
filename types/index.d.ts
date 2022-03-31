import { Balance } from "@/utils";
import {
	ButtonHTMLAttributes,
	FormHTMLAttributes,
	HTMLAttributes,
	HTMLFormElement,
	InputHTMLAttributes,
	ReactElement,
} from "react";
export {
	DeriveStakingElected,
	DeriveStakingWaiting,
	DeriveStakingQuery,
} from "@cennznet/api/derives/staking/types";

export type BridgeChain = "Ethereum" | "CENNZnet";
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

export interface BridgedEthereumToken extends EthereumToken {
	assetId: CENNZAsset["assetId"];
}

export interface CENNZAssetBalance extends CENNZAsset {
	value: Balance;
}

export type SectionUri = "swap" | "pool" | "bridge" | "stake";

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

export interface StakeAssets {
	stakingAsset: CENNZAsset;
	spendingAsset: CENNZAsset;
}

export type StakeAction = "stake" | "unstake";

export interface StakePair {
	stashAddress: string;
	controllerAddress: string;
}

export interface ElectionInfo {
	elected: DeriveStakingElected;
	waiting: DeriveStakingWaiting;
}

export interface ElectedOption {
	accountId: string;
	controllerId: string;
	stashId: string;
	stakingLedger: {
		active: string;
		total: string;
		stash: string;
	};
	validatorPrefs: {
		commission: string;
	};
}

export interface StakingElected {
	electedInfoMap: ElectedOption[];
	nextElected: string[];
	validators: string[];
}
