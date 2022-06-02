import type { IntrinsicElements } from "@/libs/types";
import { FC } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useTransfer } from "@providers/TransferProvider";
import { TransferAsset, AddressInput, TransferAssetSelect } from "@components";
import { useAddressValidation } from "@hooks";

interface TransferAssetsProps {}

const TransferAssets: FC<IntrinsicElements["div"] & TransferAssetsProps> = (
	props
) => {
	const {
		setReceiveAddress,
		receiveAddress,
		addressType,
		transferAssets,
		supportedAssets,
	} = useTransfer();

	const { inputRef: cennzAddressInputRef } = useAddressValidation(
		receiveAddress,
		addressType
	);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="transferAddressInput">Transfer Address</label>
				<AddressInput
					placeholder={"Enter a CENNZnet or Ethereum address"}
					addressType={addressType}
					value={receiveAddress}
					onChange={(e) => setReceiveAddress(e.target.value)}
					id="transferAddressInput"
					ref={cennzAddressInputRef}
				/>
				<label css={styles.assetsLabel}>Assets</label>
				{(transferAssets || supportedAssets.slice(0, 1))?.map((asset) => (
					<TransferAsset key={asset.assetId} asset={asset} />
				))}
			</div>

			<div css={styles.transferAssetSelect}>
				<TransferAssetSelect />
			</div>
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

	transferAssetSelect: css`
		margin-top: 1.5em;
		display: flex;
		justify-content: space-between;
		align-items: center;
	`,

	assetsLabel: css`
		margin-top: 25px;
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
