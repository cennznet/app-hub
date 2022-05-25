import {
	VFC,
	useEffect,
	useMemo,
	Dispatch,
	SetStateAction,
	useState,
} from "react";
import { CENNZAssetBalance, IntrinsicElements } from "@/types";
import TokenInput from "@/components/shared/TokenInput";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useCENNZBalances, useBalanceValidation, useTokenInput } from "@/hooks";
import { Balance } from "@/utils";

interface TransferAssetProps {
	assetKey: number;
	asset: CENNZAssetBalance;
	tokens: CENNZAssetBalance[];
	selectedAssets: TransferAssetType[];
	setSelectedAssets: Dispatch<SetStateAction<TransferAssetType[]>>;
}

export interface TransferAssetType {
	assetKey: number;
	asset: CENNZAssetBalance;
}

const TransferAsset: VFC<IntrinsicElements["div"] & TransferAssetProps> = ({
	assetKey,
	asset,
	tokens,
	selectedAssets,
	setSelectedAssets,
}) => {
	const [selectedAsset, setSelectedAsset] = useState<CENNZAssetBalance>(asset);
	const [assetTokenSelect, assetTokenInput] = useTokenInput(asset.assetId);
	const [assetBalance] = useCENNZBalances([selectedAsset]);

	useEffect(() => {
		const currentAsset: CENNZAssetBalance = tokens.find(
			(token) => token.assetId === assetTokenSelect.tokenId
		);
		const newTransferAsset: TransferAssetType = {
			assetKey: assetKey,
			asset: {
				...currentAsset,
			},
		};
		newTransferAsset.asset.value = Balance.fromInput(
			assetTokenInput.value,
			selectedAsset
		);
		const selectedAssetClone = [...selectedAssets];
		const currentAssetIdx = selectedAssetClone.findIndex(
			(asset) => asset.assetKey === assetKey
		);
		if (currentAssetIdx !== -1) {
			selectedAssetClone[currentAssetIdx] = newTransferAsset;
		} else {
			selectedAssetClone.push(newTransferAsset);
		}
		setSelectedAssets(selectedAssetClone);
		setSelectedAsset(currentAsset);
	}, [assetTokenInput.value, assetTokenSelect.tokenId, assetBalance]);

	const onAssetMaxRequest = useMemo(() => {
		if (!selectedAsset) return;
		const setAssetValue = assetTokenInput.setValue;
		return () => setAssetValue(assetBalance.toBalance());
	}, [assetBalance, assetTokenInput.setValue]);

	const { inputRef: assetInputRef } = useBalanceValidation(
		Balance.fromInput(assetTokenInput.value, selectedAsset),
		assetBalance
	);

	return (
		<div css={styles.root}>
			<TokenInput
				onMaxValueRequest={onAssetMaxRequest}
				selectedTokenId={assetTokenSelect.tokenId}
				onTokenChange={assetTokenSelect.onTokenChange}
				value={assetTokenInput.value}
				onValueChange={assetTokenInput.onValueChange}
				tokens={tokens}
				ref={assetInputRef}
				required
				scale={selectedAsset.decimals}
				min={Balance.fromString("1", selectedAsset).toInput()}
			/>
			{!!assetBalance && (
				<div css={styles.tokenBalance}>
					Balance: <span>{assetBalance.toBalance()}</span>
				</div>
			)}
		</div>
	);
};

export default TransferAsset;

const styles = {
	root: css`
		margin-top: 10px;
		margin-bottom: 10px;
	`,
	tokenBalance: ({ palette }: Theme) => css`
		margin-top: 0.25em;
		font-weight: 500;
		color: ${palette.grey["700"]};
		font-size: 14px;

		span {
			font-family: "Roboto Mono", monospace;
			font-weight: bold;
			letter-spacing: -0.025em;
		}
	`,
};
