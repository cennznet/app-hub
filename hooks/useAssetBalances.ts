import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { CENNZAsset } from "@/types";
import { useEffect, useState } from "react";

export default function useAssetBalances(
	asset1: CENNZAsset,
	asset2?: CENNZAsset
): [number, number] {
	const { balances } = useCENNZWallet();

	const [balance1, setBalance1] = useState<number>(null);
	const [balance2, setBalance2] = useState<number>(null);

	useEffect(() => {
		if (!balances?.length) {
			setBalance1(null);
			setBalance2(null);
			return;
		}

		const balance1Value = balances.find(
			(balance) => balance.assetId === asset1.assetId
		);

		const balance2Value = balances.find(
			(balance) => balance.assetId === asset2.assetId
		);

		setBalance1(balance1Value?.value || null);
		setBalance2(balance2Value?.value || null);
	}, [balances, asset1?.assetId, asset2?.assetId]);

	return [balance1, balance2];
}
