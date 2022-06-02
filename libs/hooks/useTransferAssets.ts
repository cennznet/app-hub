import {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useTransferableAssets } from "@hooks";
import { CENNZAssetBalances } from "@/libs/types";

export interface TransferAssetsHook {
	transferAssets: CENNZAssetBalances;
	transferableAssets: CENNZAssetBalances;
	selectableAssets: CENNZAssetBalances;

	addTransferAsset: (assetId: number) => void;
	removeTransferAsset: (assetId: number) => void;
	replaceFirstAsset: (assetId: number) => void;

	setTransferAssets: Dispatch<SetStateAction<CENNZAssetBalances>>;
}

export default function useTransferAssets(): TransferAssetsHook {
	const transferableAssets = useTransferableAssets();
	const [transferAssets, setTransferAssets] = useState<CENNZAssetBalances>();

	useEffect(() => {
		if (!transferableAssets) return;

		setTransferAssets(transferableAssets.slice(0, 1));
	}, [transferableAssets]);

	const selectableAssets = useMemo(() => {
		if (!transferableAssets || !transferAssets) return [];

		return transferableAssets?.filter((t) => {
			const foundIndex = transferAssets.findIndex(
				(d) => d.assetId === t.assetId
			);
			return foundIndex === -1;
		});
	}, [transferableAssets, transferAssets]);

	const addTransferAsset = useCallback(
		(assetId) =>
			setTransferAssets((prevAssets) =>
				prevAssets.concat(transferableAssets.find((t) => t.assetId === assetId))
			),
		[setTransferAssets, transferableAssets]
	);

	const removeTransferAsset = useCallback(
		(assetId) =>
			setTransferAssets((prevAssets) =>
				prevAssets.filter((prevAsset) => prevAsset.assetId !== assetId)
			),
		[setTransferAssets]
	);

	const replaceFirstAsset = useCallback(
		(assetId) => {
			setTransferAssets([
				transferableAssets?.find((t) => t.assetId === assetId),
			]);
		},
		[transferableAssets]
	);

	return {
		transferAssets,
		transferableAssets,
		selectableAssets,

		addTransferAsset,
		removeTransferAsset,
		replaceFirstAsset,

		setTransferAssets,
	};
}
