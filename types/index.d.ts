import { ApiRx } from "@cennznet/api";
import { Signer } from "@cennznet/api/types";
import { InjectedWindowProvider } from "@polkadot/extension-inject/types";
import { Observable } from "rxjs/internal/Observable";
import { Amount } from "@/utils/Amount";

declare global {
	interface Window {
		injectedWeb3: Record<string, InjectedWindowProvider>;
		config: IAppConfig;
		__REDUX_DEVTOOLS_EXTENSION__?: any;
	}
}

export interface FeeExchangeResult {
	amount: Amount;
	assetId: number;
}

export interface IAccounts {
	name: string;
	assets?: Asset[];
	address: string;
}

export interface IAssetSwap {
	fromAsset: number;
	toAsset: number;
	fromAssetAmount: Amount;
	toAssetAmount: Amount;
}

export interface IAppConfig {
	ENDPOINT: string;
	ENV: string;
	ASSETS: Asset[];
	FEE_BUFFER: number;
	MAX_FEE_BUFFER: number;
	MIN_FEE_BUFFER: number;
}

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

export interface AmountParams {
	amount: Amount;
	assetId: number;
	amountChange?: boolean;
}

export interface IOption {
	label: string;
	value: number | string;
}

export interface IEpicDependency {
	api$: Observable<ApiRx>;
}

export interface IExtrinsic {
	method: string;
	params: any[];
	price: Amount;
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
export interface IAssetBalance {
	assetId: number;
	account: string;
	balance: Amount;
}

export interface IFee {
	feeInCpay: Amount;
	feeInFeeAsset: Amount;
}

export interface CennznetInjected {
	signer: Signer;
	accounts$: Observable<IAccounts[]>;
	accounts: IAccounts[];
}

export interface SingleSourceInjected extends CennznetInjected {
	isPaired$: Observable<boolean>;
	isPaired: boolean;
	pairedDevice$: Observable<{
		version: string;
		id: string;
	}>;
	pairedDevice;
}

export interface AddLiquidityFormData {
	assetId: number;
	coreAssetId: number;
	assetAmount: Amount;
	coreAmount: Amount;
	feeAssetId: number;
	investor: string;
	buffer: number;
}

export interface IUserBalance {
	assetBalance: Amount;
	coreBalance: Amount;
	investor: string;
}

export interface IAddLiquidity {
	form: Partial<AddLiquidityFormData>;
	investorBalance: IUserBalance;
}

export interface RemoveLiquidityFormData {
	asset: number;
	liquidity: Amount;
	feeAssetId: number;
	investor: string;
	buffer: number;
}

export interface IRemoveLiquidity {
	form: Partial<RemoveLiquidityFormData>;
	estimatedAssetToWithdraw: {
		core: Amount;
		asset: Amount;
	};
}

export interface ITxFeeParams {
	extrinsicParams: any[];
	feeAsset: number;
	investor: string;
}

export interface ExchangeFormData {
	fromAsset: number;
	toAsset: number;
	fromAssetAmount: Amount;
	toAssetAmount: Amount;
	signingAccount: string;
	extrinsic: string; //'buyAsset' | 'sellAsset'
	feeAssetId: number;
	buffer: number;
}

export interface SendFormData {
	fromAsset: number;
	toAsset: number;
	fromAssetAmount: Amount;
	toAssetAmount: Amount;
	signingAccount: string;
	recipientAddress: string;
	extrinsic: string; //'buyAsset' | 'sellAsset'
	feeAssetId: number;
	buffer: number;
}

export interface LiquidityFormData {
	assetId: number;
	assetAmount: Amount;
	coreAssetId: number;
	coreAmount: Amount;
	signingAccount: string;
	extrinsic: string;
	feeAssetId: number;
	buffer: number;
	type: string;
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

export interface CENNZnetAccount {
	name: string;
	address: string;
}

export type BridgeState = "Deposit" | "Withdraw";

export interface GenericCoin {
	decimals: number;
	symbol: string;
}

export interface CENNZnetAsset extends GenericCoin {
	assetId: number;
}

export interface EthereumToken extends GenericCoin {
	address: string;
}
