import { useCallback, useState } from "react";
import { fetchUnclaimedWithdrawals } from "@/utils";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useBridge } from "@/providers/BridgeProvider";
import { WithdrawClaim } from "@/types";

export default function useUnclaimedWithdrawals(): [
	WithdrawClaim[],
	() => Promise<void>
] {
	const [unclaimedWithdrawals, setUnclaimedWithdrawals] =
		useState<WithdrawClaim[]>();
	const { api } = useCENNZApi();
	const { selectedAccount: CENNZAccount } = useCENNZWallet();
	const { setAdvancedMounted } = useBridge();

	const updateUnclaimedWithdrawals = useCallback(async () => {
		if (!api || !CENNZAccount) return;
		setAdvancedMounted(false);

		const unclaimed: Awaited<ReturnType<typeof fetchUnclaimedWithdrawals>> =
			await fetchUnclaimedWithdrawals(CENNZAccount.address, api);

		setUnclaimedWithdrawals(unclaimed?.filter(Boolean));

		setAdvancedMounted(true);
	}, [api, CENNZAccount, setAdvancedMounted]);

	return [unclaimedWithdrawals, updateUnclaimedWithdrawals];
}
