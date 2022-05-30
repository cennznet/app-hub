import { useCallback, useEffect, useState } from "react";
import { useTransferableAssets } from "@/hooks";
import { TransferDisplayAssets } from "@/types";

interface TransferDisplayAssetsHook {
	displayAssets: TransferDisplayAssets;
	addDisplayAsset: () => void;
	removeDisplayAsset: (index: number) => void;
	resetDisplayAssets: () => void;
}

export default function useTransferDisplayAssets(): TransferDisplayAssetsHook {
	const transferableAssets = useTransferableAssets();
	const [displayAssets, setDisplayAssets] = useState<TransferDisplayAssets>();

	const resetDisplayAssets = useCallback(() => {
		setDisplayAssets({
			amount: 0,
			assets: null,
		});
		setDisplayAssets({
			amount: 1,
			assets: transferableAssets.slice(0, 1),
		});
	}, [transferableAssets]);

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
		resetDisplayAssets,
	};
}
