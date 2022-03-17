import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useCallback, useEffect, useState } from "react";
import { fetchPoolUserBalances } from "@/utils";
import { CENNZAsset } from "@/types";

export interface PoolBalancesHook {
	tradePoolBalance: number;
	corePoolBalance: number;
	updatingPoolBalances: boolean;
	updatePoolBalances: () => Promise<void>;
}

export default function usePoolBalances(
	tradeAsset: CENNZAsset,
	coreAsset: CENNZAsset
): PoolBalancesHook {
	const { selectedAccount } = useCENNZWallet();
	const { api } = useCENNZApi();
	const [tradeBalance, setTradeBalance] = useState<number>(null);
	const [coreBalance, setCoreBalance] = useState<number>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const updatePoolBalances = useCallback(async () => {
		if (!api || !selectedAccount?.address) return;
		setLoading(true);
		const { tradeBalance, coreBalance } = await fetchPoolUserBalances(
			api,
			selectedAccount.address,
			tradeAsset,
			coreAsset
		);

		setTradeBalance(tradeBalance);
		setCoreBalance(coreBalance);
		setLoading(false);
	}, [api, selectedAccount?.address, tradeAsset, coreAsset]);

	useEffect(() => {
		updatePoolBalances();
	}, [updatePoolBalances]);

	return {
		tradePoolBalance: tradeBalance,
		corePoolBalance: coreBalance,
		updatingPoolBalances: loading,
		updatePoolBalances,
	};
}
