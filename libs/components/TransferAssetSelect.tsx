import { FC } from "react";
import { css, FormControl, InputLabel, MenuItem, Theme } from "@mui/material";
import { getTokenLogo } from "@/libs/utils";
import { SelectInput } from "@/libs/components";
import { useTransfer } from "@/libs/providers/TransferProvider";

const TransferAssetSelect: FC = () => {
	const { transferAssets, addTransferAsset, selectableAssets } = useTransfer();

	const readOnly = !transferAssets?.length || !selectableAssets?.length;

	return (
		<FormControl css={styles.root(readOnly)}>
			<InputLabel id="transferAssetSelect" shrink={false}>
				Add Asset
			</InputLabel>
			<SelectInput
				labelId="transferAssetSelect"
				value=""
				defaultValue=""
				css={styles.select}
				inputProps={{ sx: styles.selectItem as any }}
				readOnly={readOnly}
				renderValue={() => null}
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
		</FormControl>
	);
};

export default TransferAssetSelect;

const styles = {
	root:
		(readOnly: boolean) =>
		({ palette }: Theme) =>
			css`
				label {
					font-weight: bold;
					font-size: 14px;
					text-transform: uppercase;
					margin-top: -0.1em;
					color: ${readOnly ? palette.text.primary : palette.primary.main};
					padding-right: ${readOnly && "1em"};
					padding-left: ${readOnly && "1em"};
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
