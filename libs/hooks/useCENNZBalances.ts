import { BridgedEthereumToken, CENNZAsset } from "@/libs/types";
import { Balance, fetchCENNZAssetBalances } from "@utils";
import { useEffect, useState } from "react";
import { useCENNZApi } from "@providers/CENNZApiProvider";
import { useSelectedAccount } from "@hooks";

export default function useCENNZBalances(
	assets: CENNZAsset[] | BridgedEthereumToken[]
): Balance[] {
	const { api } = useCENNZApi();
	const selectedAccount = useSelectedAccount();
	const [balances, setBalances] = useState<Balance[]>([]);

	useEffect(() => {
		if (!api || !assets || !selectedAccount?.address) return;

		fetchCENNZAssetBalances(api, selectedAccount.address, assets).then(
			(balances) =>
				setBalances(balances.map((balance) => balance?.value || null))
		);
	}, [api, assets, selectedAccount?.address]);

	return balances;
}
