import { Balance } from "@/utils";
import {
	AnchorHTMLAttributes,
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
export { EraIndex, Nominations, Option, StorageKey } from "@cennznet/types";
export { DeriveHeartbeats } from "@polkadot/api-derive/types";

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
	a: AnchorHTMLAttributes<HTMLAnchorElement>;
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
	title: string | ReactElement;
	message: string | ReactElement;
}

export type RelayerStatus =
	| "Successful"
	| "Failed"
	| "EthereumConfirming"
	| "CennznetConfirming";

export type RelayerConfirmingStatus = Extract<
	RelayerStatus,
	"EthereumConfirming" | "CennznetConfirming"
>;

export interface StakeAssets {
	stakingAsset: CENNZAsset;
	spendingAsset: CENNZAsset;
}

export type StakeAction =
	| "addStake"
	| "newStake"
	| "chill"
	| "changeNominations"
	| "cancelWithdrawal"
	| "changeController"
	| "changeRewardDestination"
	| "withdraw"
	| "unstake"
	| "viewStake";

export interface StakePair {
	stashAddress: string;
	controllerAddress: string;
}

export interface ElectionInfo {
	elected: DeriveStakingElected;
	waiting: DeriveStakingWaiting;
}

export interface ElectedCandidate {
	accountId: string;
	controllerId: string;
	exposure: {
		total: string;
	};
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
	electedInfoMap: ElectedCandidate[];
	nextElected: string[];
	validators: string[];
}

export type OverviewTable = "elected" | "nominate";

export interface NominatedBy {
	index: number;
	nominatorId: string;
	submittedIn: EraIndex;
}

export type Result = Record<string, NominatedBy[]>;

export interface StakeDestinationInput {
	action: StakeAction;
	value: string;
}

export interface AccountLedger {
	active: number;
	stash: string;
	total: number;
	unlocking: AccountUnlocking[];
}

export interface AccountUnlocking {
	value: number;
	era: number;
}
