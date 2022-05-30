import { useCallback, useEffect, useState } from "react";
import { useTransferableAssets } from "@/hooks";
import { TransferDisplayAssets } from "@/types";

export default function useTransferDisplayAssets() {
	const transferableAssets = useTransferableAssets();
	const [displayAssets, setDisplayAssets] = useState<TransferDisplayAssets>();

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

	return [displayAssets, addDisplayAsset, removeDisplayAsset] as const;
}
