import { CENNZAssetBalances } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useTransferableAssets } from "@/hooks";

interface DisplayAssets {
	amount: number;
	assets: CENNZAssetBalances;
}

export default function useTransferDisplayAssets(): {
	displayAssets: DisplayAssets;
	addDisplayAsset: () => void;
	removeDisplayAsset: (index: number) => void;
} {
	const transferableAssets = useTransferableAssets();
	const [displayAssets, setDisplayAssets] = useState<DisplayAssets>();

	useEffect(() => {
		if (!transferableAssets) return;

		setDisplayAssets({
			amount: 1,
			assets: transferableAssets.slice(0, 1),
		});
	}, [transferableAssets]);

	const addDisplayAsset = useCallback(
		() =>
			setDisplayAssets({
				amount: displayAssets.amount + 1,
				assets: transferableAssets.slice(0, displayAssets.amount + 1),
			}),
		[displayAssets, transferableAssets]
	);

	const removeDisplayAsset = useCallback(
		(index) => {
			displayAssets.assets.splice(index, 1);
			setDisplayAssets({
				amount: displayAssets.amount - 1,
				assets: displayAssets.assets,
			});
		},
		[displayAssets]
	);

	return {
		displayAssets,
		addDisplayAsset,
		removeDisplayAsset,
	};
}
