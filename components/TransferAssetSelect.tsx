import { FC } from "react";
import { css, MenuItem, Theme } from "@mui/material";
import getTokenLogo from "../utils/getTokenLogo";
import SelectInput from "@/components/shared/SelectInput";
import { useTransfer } from "@/providers/TransferProvider";

const TransferAssetSelect: FC = () => {
	const { addTransferAsset, selectableAssets } = useTransfer();

	return (
		<div css={styles.root}>
			<label htmlFor="transferAssetSelect">Add Asset</label>
			<SelectInput
				css={styles.select}
				inputProps={{ sx: styles.selectItem as any }}
				onChange={(e) => addTransferAsset(e.target.value as number)}
			>
				{selectableAssets?.map((asset) => {
					const { symbol, assetId } = asset;
					const logo = getTokenLogo(symbol);
					return (
						<MenuItem key={assetId} value={assetId} css={styles.selectItem}>
							{logo && <img src={logo.src} alt={symbol} />}
							<span>{symbol}</span>
						</MenuItem>
					);
				})}
			</SelectInput>
		</div>
	);
};

export default TransferAssetSelect;

const styles = {
	root: ({ palette }: Theme) => css`
		label {
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	select: css`
		min-width: 135px;
	`,

	selectItem: css`
		display: flex;
		align-items: center;
		padding-top: 0.75em;
		padding-bottom: 0.75em;

		> img {
			width: 2em;
			height: 2em;
			object-fit: contain;
			margin-right: 0.5em;
		}

		> span {
			font-size: 14px;
			font-weight: bold;
			flex: 1;
		}
	`,
};
