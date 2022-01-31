import { useAssets, AssetInfo } from "./SupportedAssetsProvider";
import { FeeRate } from "@cennznet/types";
import { Amount } from "../utils/Amount";
import {
	AmountParams,
	Asset,
	IFee,
	IOption,
	IUserShareInPool,
	LiquidityFormData,
} from "../types/exchange";
import { createContext, PropsWithChildren, useContext } from "react";

export enum PoolAction {
	ADD = "Add",
	REMOVE = "Withdraw",
}

export type PoolContextType = {
	// balance of selected asset in the exchange
	assetReserve: Amount;
	// balance of core asset in the exchange
	coreReserve: Amount;
	// current account's balance of the selected asset
	accountAssetBalance: Amount;
	// current account's balance of the core asset
	accountCoreBalance: Amount;
	exchangeRateMsg?: string;
	txFeeMsg: string;
	coreAssetId: number;
	fee: any;
	feeRate: FeeRate;
	userShareInPool: IUserShareInPool;
};

const poolContextDefaultValues = {
	assetReserve: null,
	coreReserve: null,
	accountAssetBalance: null,
	accountCoreBalance: null,
	exchangeRateMsg: null,
	txFeeMsg: null,
	coreAssetId: null,
	fee: null,
	feeRate: null,
	userShareInPool: null,
};

const PoolContext = createContext<PoolContextType>(poolContextDefaultValues);

type ProviderProps = {};

export default function PoolProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	return (
		<PoolContext.Provider value={poolContextDefaultValues}>
			{children}
		</PoolContext.Provider>
	);
}

export function usePool(): PoolContextType {
	return useContext(PoolContext);
}
