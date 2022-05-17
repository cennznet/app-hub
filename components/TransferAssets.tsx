import { VFC, useState } from "react";
import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useTransfer } from "@/providers/TransferProvider";
import TransferAsset from "@/components/TransferAsset";

interface TransferAssetsProps {}

const TransferAssets: VFC<IntrinsicElements["div"] & TransferAssetsProps> = (
	props
) => {
	const { transferableAssets } = useTransfer();

	const [assetAmount, setAssetAmount] = useState<number>();

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				{transferableAssets?.map((asset) => {
					return <TransferAsset asset={asset} />;
				})}
			</div>
			<button type="button" onClick={() => setAssetAmount(assetAmount + 1)}>
				Add Asset
			</button>
		</div>
	);
};

export default TransferAssets;

const styles = {
	root: css``,

	formField: ({ palette }: Theme) => css`
		margin-bottom: 1em;

		label {
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	formControl: (isConnected: boolean) => css`
		margin-bottom: 1em;
		margin-top: ${isConnected ? "1em" : "2em"};
		text-align: center;
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
