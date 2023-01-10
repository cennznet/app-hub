import { BridgedEthereumTokens, CENNZAssets } from "@/libs/types";
import { Balance } from "@/libs/utils";
import { useMemo } from "react";
import { useWalletProvider } from "@/libs/providers/WalletProvider";

export default function useCENNZBalances(
	assets: CENNZAssets | BridgedEthereumTokens
): Balance[] {
	const { cennzBalances } = useWalletProvider();

	return useMemo(() => {
		if (!cennzBalances) return new Array(assets.length).fill(null);

		return assets
			.map((asset) =>
				cennzBalances.find((balance) => balance.assetId === asset.assetId)
			)
			.map((balance) => balance?.value || null);
	}, [assets, cennzBalances]);
}
