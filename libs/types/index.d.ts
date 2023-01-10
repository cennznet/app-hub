import { Balance } from "@/libs/utils";
import {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	FormHTMLAttributes,
	HTMLAttributes,
	HTMLFormElement,
	InputHTMLAttributes,
	ReactNode,
} from "react";
export {
	DeriveStakingElected,
	DeriveStakingWaiting,
	DeriveStakingQuery,
} from "@cennznet/api/derives/staking/types";
export { EraIndex, Nominations, Option, StorageKey } from "@cennznet/types";
export { DeriveHeartbeats } from "@polkadot/api-derive/types";
import { u128 } from "@polkadot/types-codec";

export { SubmittableExtrinsic } from "@cennznet/api/types";
export { CENNZnetExtrinsic } from "@cennznet/types/interfaces/extrinsic";

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

export type CENNZAssets = Array<CENNZAsset>;

export interface EthereumToken extends GenericCoin {
	address: string;
}

export interface BridgedEthereumToken extends EthereumToken {
	assetId: CENNZAsset["assetId"];
}

export type BridgedEthereumTokens = Array<BridgedEthereumToken>;

export interface CENNZAssetBalance extends CENNZAsset {
	value: Balance;
	rawValue?: u128;
}

export type CENNZAssetBalances = Array<CENNZAssetBalance>;

export type SectionUri = "swap" | "pool" | "bridge" | "transfer" | "stake";

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

export type StakeAction = "stake" | "unstake";

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
export interface CENNZEvent {
	section?: string;
	method?: string;
	data?: any[];
}

export interface WithdrawClaim {
	assetId: number;
	expiry: string;
	expiryRaw: number;
	eventProofId: number;
	transferAsset: BridgedEthereumToken;
	transferAmount: Balance;
	beneficiary: string;
	eventProof: HistoricalEventProof;
}

export interface HistoricalEventProof {
	_id?: string;
	eventId?: string;
	validatorSetId: string;
	validators: [];
	r: string[];
	s: string[];
	v: number[];
}

export type TxType = "Idle" | "Pending" | "Success" | "Failure";

export interface TxStatus {
	status: TxType;
	props?: any;
}

export type WalletOption = "CENNZnet" | "MetaMask";

export type ChainOption = "CENNZnet" | "Ethereum";

export interface TransferAssetType {
	assetKey: number;
	asset: CENNZAssetBalance;
}

export type TransferAssets = Array<TransferAssetType>;

export interface TransferDisplayAssets {
	amount: number;
	assets: CENNZAssetBalances;
}

export interface PropsWithChildren {
	children?: ReactNode;
}
