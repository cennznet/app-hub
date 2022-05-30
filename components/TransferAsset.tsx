import {
	VFC,
	useEffect,
	useMemo,
	Dispatch,
	SetStateAction,
	useCallback,
} from "react";
import { CENNZAssetBalance, IntrinsicElements } from "@/types";
import TokenInput from "@/components/shared/TokenInput";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useCENNZBalances, useBalanceValidation, useTokenInput } from "@/hooks";
import { Balance } from "@/utils";
import StandardButton from "@/components/shared/StandardButton";
import { useTransfer } from "@/providers/TransferProvider";

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
	const { displayAssets, removeDisplayAsset } = useTransfer();
	const [assetTokenSelect, assetTokenInput] = useTokenInput(asset.assetId);

	const currentAsset = useMemo<CENNZAssetBalance>(
		() => tokens.find((token) => token.assetId === assetTokenSelect.tokenId),
		[tokens, assetTokenSelect.tokenId]
	);
	const [assetBalance] = useCENNZBalances([currentAsset]);

	useEffect(() => {
		const newTransferAsset: TransferAssetType = {
			assetKey,
			asset: currentAsset,
		};
		newTransferAsset.asset.value = Balance.fromInput(
			assetTokenInput.value,
			currentAsset
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

		//FIXME: adding 'currentAsset' or 'selectedAssets' causes a delay in rendering
		/* eslint-disable-next-line */
	}, [
		assetTokenInput.value,
		assetTokenSelect.tokenId,
		assetBalance,
		setSelectedAssets,
		assetKey,
	]);

	const onAssetMaxRequest = useMemo(() => {
		if (!currentAsset) return;
		const setAssetValue = assetTokenInput.setValue;
		return () => setAssetValue(assetBalance.toBalance());
	}, [currentAsset, assetBalance, assetTokenInput.setValue]);

	const { inputRef: assetInputRef } = useBalanceValidation(
		Balance.fromInput(assetTokenInput.value, currentAsset),
		assetBalance
	);

	const onRemoveClick = useCallback(() => {
		const removeIndex = displayAssets.assets.findIndex(
			(displayAsset) => displayAsset.assetId === currentAsset.assetId
		);
		removeDisplayAsset(removeIndex);
	}, [displayAssets, removeDisplayAsset, currentAsset?.assetId]);

	return (
		<div css={styles.root}>
			<div css={styles.transferAssetContainer}>
				<TokenInput
					onMaxValueRequest={onAssetMaxRequest}
					selectedTokenId={assetTokenSelect.tokenId}
					onTokenChange={assetTokenSelect.onTokenChange}
					value={assetTokenInput.value}
					onValueChange={assetTokenInput.onValueChange}
					tokens={tokens}
					ref={assetInputRef}
					required
					scale={currentAsset?.decimals}
					min={Balance.fromString("1", currentAsset).toInput()}
				/>
				<StandardButton onClick={onRemoveClick} variant={"secondary"}>
					X
				</StandardButton>
			</div>
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
	transferAssetContainer: css`
		display: flex;
		justify-content: space-between;
		button {
			margin-left: 5px;
			padding: 0.75em 1em;
		}
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
