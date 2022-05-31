import { VFC, useEffect, useCallback } from "react";
import { CENNZAssetBalance, IntrinsicElements } from "@/types";
import TokenInput from "@/components/shared/TokenInput";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useCENNZBalances, useBalanceValidation, useTokenInput } from "@/hooks";
import { Balance } from "@/utils";
import StandardButton from "@/components/shared/StandardButton";
import { useTransfer } from "@/providers/TransferProvider";

interface TransferAssetProps {
	asset: CENNZAssetBalance;
}

const TransferAsset: VFC<IntrinsicElements["div"] & TransferAssetProps> = ({
	asset,
}) => {
	const {
		transferAssets,
		setTransferAssets,
		transferableAssets,
		replaceFirstAsset,
	} = useTransfer();
	const [assetTokenSelect, assetTokenInput] = useTokenInput(asset.assetId);

	const [assetBalance] = useCENNZBalances([asset]);

	useEffect(() => {
		const newTransferAsset = {
			...asset,
			value: Balance.fromInput(assetTokenInput.value, asset),
		};
		setTransferAssets((prevAssets) => {
			const currentAssetIdx = prevAssets.findIndex(
				(asset) => asset.assetId === assetTokenSelect.tokenId
			);
			if (currentAssetIdx !== -1) {
				prevAssets[currentAssetIdx] = newTransferAsset;
				return prevAssets;
			}
			return prevAssets.concat(newTransferAsset);
		});
	}, [
		transferAssets,
		setTransferAssets,
		assetTokenInput.value,
		assetTokenSelect.tokenId,
		asset,
	]);

	const onAssetMaxRequest = useCallback(() => {
		if (!assetTokenInput?.setValue || !assetBalance) return;
		assetTokenInput.setValue(assetBalance.toBalance());
	}, [assetBalance, assetTokenInput]);

	const { inputRef: assetInputRef } = useBalanceValidation(
		Balance.fromInput(assetTokenInput.value, asset),
		assetBalance
	);

	const onRemoveClick = useCallback(() => {
		setTransferAssets((prevAssets) =>
			prevAssets.filter((prevAsset) => prevAsset.assetId !== asset.assetId)
		);
	}, [asset.assetId, setTransferAssets]);

	return (
		<div css={styles.root}>
			<div css={styles.transferAssetContainer}>
				<TokenInput
					onMaxValueRequest={onAssetMaxRequest}
					selectedTokenId={assetTokenSelect.tokenId}
					onTokenChange={(e) => replaceFirstAsset(Number(e.target.value))}
					value={assetTokenInput.value}
					onValueChange={assetTokenInput.onValueChange}
					tokens={transferAssets?.length === 1 ? transferableAssets : [asset]}
					ref={assetInputRef}
					required
					scale={asset.decimals}
					min={Balance.fromString("1", asset).toInput()}
				/>
				{transferAssets.length !== 1 && (
					<StandardButton onClick={onRemoveClick} variant={"secondary"}>
						X
					</StandardButton>
				)}
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
