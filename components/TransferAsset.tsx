import { VFC, useEffect, useMemo } from "react";
import { CENNZAssetBalance, IntrinsicElements } from "@/types";
import TokenInput from "@/components/shared/TokenInput";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useCENNZBalances, useBalanceValidation, useTokenInput } from "@/hooks";
import { Balance } from "@/utils";

interface TransferAssetProps {
	asset: CENNZAssetBalance;
}

const TransferAsset: VFC<IntrinsicElements["div"] & TransferAssetProps> = ({
	asset,
}) => {
	const [assetTokenSelect, assetTokenInput] = useTokenInput(asset.assetId);
	const [assetBalance] = useCENNZBalances([asset]);
	useEffect(() => {
		//TODO create setvalue prop from parent
		console.info("assetTokenInput", assetTokenInput.value);
		console.info("assetTokenSelect", assetTokenSelect.tokenId);
	}, [assetTokenInput, assetTokenSelect]);

	const onAssetMaxRequest = useMemo(() => {
		if (!asset) return;
		const setAssetValue = assetTokenInput.setValue;
		return () => setAssetValue(assetBalance.toBalance());
	}, [assetBalance, assetTokenInput.setValue]);

	const { inputRef: assetInputRef } = useBalanceValidation(
		Balance.fromInput(assetTokenInput.value, asset),
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
				tokens={[asset]}
				id={`assetInput_${asset.assetId}`}
				ref={assetInputRef}
				required
				scale={asset.decimals}
				min={Balance.fromString("1", asset).toInput()}
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
