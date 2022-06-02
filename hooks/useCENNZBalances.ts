import { BridgedEthereumToken, CENNZAsset } from "@/types";
import { Balance } from "@/utils";
import { useEffect, useState } from "react";
import { useWalletProvider } from "@/providers/WalletProvider";

export default function useCENNZBalances(
	assets: CENNZAsset[] | BridgedEthereumToken[]
): Balance[] {
	const { cennzBalances } = useWalletProvider();
	const [balances, setBalances] = useState<Balance[]>([]);

	useEffect(() => {
		if (!cennzBalances?.length) {
			setBalances(new Array(assets.length).fill(null));
			return;
		}
		const requestedBalanceAssetIds = assets.map((balance) => balance.assetId);

		const requestedCENNZBalances = requestedBalanceAssetIds.map((assetId) =>
			cennzBalances.find((balance) => balance.assetId === assetId)
		);
		const requestedBalances = requestedCENNZBalances.map(
			(balance) => balance?.value || null
		);
		setBalances(requestedBalances);
	}, [cennzBalances, JSON.stringify(assets)]);

	return balances;
}
