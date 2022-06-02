import { VFC, useEffect, useCallback } from "react";
import { CENNZAsset, CENNZAssetBalance, IntrinsicElements } from "@/types";
import TokenInput from "@/components/shared/TokenInput";
import { css } from "@emotion/react";
import { LinearProgress, Theme } from "@mui/material";
import {
	useCENNZBalances,
	useBalanceValidation,
	useTokenInput,
	useSelectedAccount,
} from "@/hooks";
import { Balance } from "@/utils";
import StandardButton from "@/components/shared/StandardButton";
import { useTransfer } from "@/providers/TransferProvider";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";

interface TransferAssetProps {
	asset: CENNZAsset | CENNZAssetBalance;
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
	const selectedAccount = useSelectedAccount();

	useEffect(() => {
		if (!transferAssets?.length) return;

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
				{!!transferAssets?.length && transferAssets?.length !== 1 && (
					<StandardButton onClick={onRemoveClick} variant={"secondary"}>
						<ClearRoundedIcon css={styles.clearIcon} />
					</StandardButton>
				)}
			</div>
			{!!assetBalance && (
				<div css={styles.tokenBalance}>
					Balance: <span>{assetBalance.toBalance()}</span>
				</div>
			)}
			{!!selectedAccount && !assetBalance && (
				<LinearProgress css={styles.formInfoProgress} />
			)}
		</div>
	);
};

export default TransferAsset;

const styles = {
	root: css`
		margin-top: 0.5em;
		margin-bottom: 1em;
	`,

	transferAssetContainer: css`
		display: flex;
		justify-content: space-between;
		button {
			margin-left: 5px;
			padding-right: 1em;
			padding-left: 1em;
		}
	`,

	clearIcon: css`
		margin-top: 0.2em;
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

	formInfoProgress: css`
		display: inline-block;
		width: 25px;
		border-radius: 10px;
		opacity: 0.5;
	`,
};
