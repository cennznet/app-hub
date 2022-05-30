import { VFC, useState, useEffect, useCallback } from "react";
import { CENNZAssetBalance, IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useTransfer } from "@/providers/TransferProvider";
import TransferAsset, { TransferAssetType } from "@/components/TransferAsset";
import StandardButton from "@/components/shared/StandardButton";
import AddressInput from "@/components/shared/AddressInput";
import useAddressValidation from "@/hooks/useAddressValidation";
import { useTransferableAssets } from "@/hooks";

interface TransferAssetsProps {}

const TransferAssets: VFC<IntrinsicElements["div"] & TransferAssetsProps> = (
	props
) => {
	const {
		setTransferAssets,
		setReceiveAddress,
		receiveAddress,
		addressType,
		displayAssets,
		addDisplayAsset,
		removeDisplayAsset,
	} = useTransfer();

	const [selectedAssets, setSelectedAssets] = useState<TransferAssetType[]>([]);
	const [dropDownTokens, setDropDownTokens] = useState<CENNZAssetBalance[][]>(
		[]
	);
	const transferableAssets = useTransferableAssets();

	const { inputRef: cennzAddressInputRef } = useAddressValidation(
		receiveAddress,
		addressType
	);

	useEffect(() => {
		if (!transferableAssets) return;
		//remove all tokens that are selected from all other display token arrays
		const selectedAssetIds = selectedAssets.map((asset) => asset.asset.assetId);
		const displayTokenArr = selectedAssets.map((selectedAsset) => {
			return transferableAssets
				.filter((asset) => !selectedAssetIds.includes(asset.assetId))
				.concat(selectedAsset.asset);
		});
		//add additional display token to prep for user adding asset
		displayTokenArr.push(
			transferableAssets.filter(
				(asset) => !selectedAssetIds.includes(asset.assetId)
			)
		);

		setDropDownTokens(displayTokenArr.slice(0, displayAssets?.amount));
	}, [displayAssets?.amount, selectedAssets, transferableAssets]);

	useEffect(() => {
		if (!selectedAssets) return;

		setTransferAssets(
			selectedAssets.map((asset) => asset.asset).slice(0, displayAssets?.amount)
		);
	}, [selectedAssets, displayAssets?.amount, setTransferAssets]);

	const onAddAssetClick = useCallback(() => {
		if (displayAssets?.amount > transferableAssets?.length) return;

		addDisplayAsset();
	}, [addDisplayAsset, displayAssets?.amount, transferableAssets?.length]);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="transferCENNZAddressInput">Transfer Address</label>
				<AddressInput
					placeholder={"Enter a CENNZnet or Ethereum address"}
					addressType={addressType}
					value={receiveAddress}
					onChange={(e) => setReceiveAddress(e.target.value)}
					id="transferCENNZAddressInput"
					ref={cennzAddressInputRef}
				/>
				<label css={styles.assetsLabel}>Assets</label>
				{displayAssets?.assets?.map((asset, index) => (
					<TransferAsset
						key={index}
						assetKey={index}
						asset={
							displayAssets?.amount !== 1 && dropDownTokens[index]
								? dropDownTokens[index][0]
								: asset
						}
						tokens={
							dropDownTokens[index] ? dropDownTokens[index] : transferableAssets
						}
						setSelectedAssets={setSelectedAssets}
					/>
				))}
			</div>
			<div css={styles.addRemoveAssets}>
				<StandardButton
					type="button"
					disabled={
						displayAssets?.amount === transferableAssets?.length ||
						!transferableAssets ||
						!displayAssets
					}
					onClick={onAddAssetClick}
				>
					Add Asset
				</StandardButton>
				<StandardButton
					disabled={!displayAssets || displayAssets?.amount <= 1}
					type="button"
					onClick={() => removeDisplayAsset(-1)}
				>
					Remove Asset
				</StandardButton>
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

	addRemoveAssets: css`
		display: flex;
		justify-content: space-between;
		align-items: center;
	`,

	assetsLabel: css`
		margin-top: 25px;
	`,
};
