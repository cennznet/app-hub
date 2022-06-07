import type { CENNZAssetBalances } from "@/libs/types";

import { useEffect, useState } from "react";
import { useSelectedAccount } from "@/libs/hooks";
import { fetchCENNZAssetBalances } from "@/libs/utils";
import { useCENNZApi } from "@/libs/providers/CENNZApiProvider";

export default function useTransferableAssets() {
	const { api } = useCENNZApi();
	const selectedAccount = useSelectedAccount();
	const [transferableAssets, setTransferableAssets] =
		useState<CENNZAssetBalances>();

	useEffect(() => {
		if (!api || !selectedAccount) return;

		fetchCENNZAssetBalances(api, selectedAccount.address)
			.then((balances) =>
				setTransferableAssets(
					balances.filter((balance) => balance.value.toNumber() > 0)
				)
			)
			.catch((err) => console.error(err.message));
	}, [selectedAccount, api]);

	return transferableAssets;
}
