import { Dispatch, SetStateAction, useCallback } from "react";
import fetchCENNZAssetBalances from "@/utils/fetchCENNZAssetBalances";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useWalletProvider } from "@/providers/WalletProvider";
import { useSelectedAccount } from "@/hooks";
import { CENNZAssetBalance } from "@/types";

export default function useUpdateCENNZBalances(): (
	setBalances: Dispatch<SetStateAction<CENNZAssetBalance[]>>
) => Promise<void> {
	const { api } = useCENNZApi();
	const { selectedWallet } = useWalletProvider();

	const selectedAccount = useSelectedAccount();

	return useCallback(
		async (setBalances) => {
			if (!api || !selectedWallet || !selectedAccount || !setBalances) return;

			const balances = await fetchCENNZAssetBalances(
				api,
				selectedAccount.address
			);

			setBalances(balances);
		},
		[selectedAccount, selectedWallet, api]
	);
}
