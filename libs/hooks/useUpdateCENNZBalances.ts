import { useCallback } from "react";
import { fetchCENNZAssetBalances } from "@utils";
import { useCENNZApi } from "@providers/CENNZApiProvider";
import { useWalletProvider } from "@providers/WalletProvider";
import { useSelectedAccount } from "@hooks";

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
