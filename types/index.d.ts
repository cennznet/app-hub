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

export type SectionUri = "swap" | "pool" | "bridge";

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

interface CENNZMetaMaskNetwork {
	cennzTokenAddress: string;
	chainId: string;
	chainName: string;
	rpcUrl: string;
}
