import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { usePool } from "@/providers/PoolProvider";
import { useCallback, useEffect, useState } from "react";
import { fetchPoolUserBalances } from "@/utils";

export default function usePoolBalances(): [number, number, () => void] {
	const { selectedAccount } = useCENNZWallet();
	const { api } = useCENNZApi();
	const [tradeBalance, setTradeBalance] = useState<number>(null);
	const [coreBalance, setCoreBalance] = useState<number>(null);
	const { tradeAsset, coreAsset } = usePool();

	const updatePoolBalances = useCallback(async () => {
		if (!api || !selectedAccount?.address) return;
		const { tradeBalance, coreBalance } = await fetchPoolUserBalances(
			api,
			selectedAccount.address,
			tradeAsset,
			coreAsset
		);

		setTradeBalance(tradeBalance);
		setCoreBalance(coreBalance);
	}, [api, selectedAccount?.address, tradeAsset, coreAsset]);

	useEffect(() => {
		updatePoolBalances();
	}, [updatePoolBalances]);

	return [tradeBalance, coreBalance, updatePoolBalances];
}
