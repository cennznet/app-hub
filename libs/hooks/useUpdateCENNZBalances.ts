import { useCallback } from "react";
import { fetchCENNZAssetBalances } from "@/libs/utils";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";
import { useWalletProvider } from "@/libs/providers/WalletProvider";
import { useSelectedAccount } from "@/libs/hooks";

export default function useUpdateCENNZBalances(): () => Promise<void> {
	const { api } = useCENNZApi();
	const { selectedWallet, setCENNZBalances } = useWalletProvider();

	const selectedAccount = useSelectedAccount();

	return useCallback(async () => {
		if (!api || !selectedWallet || !selectedAccount) return;

		const balances = await fetchCENNZAssetBalances(
			api,
			selectedAccount.address
		);

		setCENNZBalances(balances);
	}, [selectedAccount, selectedWallet, api, setCENNZBalances]);
}
