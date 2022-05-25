import { VFC, useState, useEffect, useCallback } from "react";
import { CENNZAssetBalance, IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useTransfer } from "@/providers/TransferProvider";
import TransferAsset, { TransferAssetType } from "@/components/TransferAsset";
import StandardButton from "@/components/shared/StandardButton";
import AddressInput from "@/components/shared/AddressInput";
import useAddressValidation from "@/hooks/useAddressValidation";

interface TransferAssetsProps {}

const TransferAssets: VFC<IntrinsicElements["div"] & TransferAssetsProps> = (
	props
) => {
	const {
		transferableAssets,
		setTransferAssets,
		setReceiveAddress,
		receiveAddress,
	} = useTransfer();

	const [assetAmount, setAssetAmount] = useState<{ amount: number }>({
		amount: 1,
	});
	const [selectedAssets, setSelectedAssets] = useState<TransferAssetType[]>([]);
	const [displayTokens, setDisplayTokens] = useState<CENNZAssetBalance[][]>([]);

	useEffect(() => {
		setAssetAmount({ amount: 1 });
	}, [transferableAssets]);

	const onTransferCENNZAddressChange = useCallback(
		(event) => {
			setReceiveAddress(event.target.value);
		},
		[setReceiveAddress]
	);

	const { inputRef: cennzAddressInputRef } = useAddressValidation(
		receiveAddress,
		"CENNZnet"
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
		const transferAssets: CENNZAssetBalance[] = selectedAssets.map(
			(asset) => asset.asset
		);
		setDisplayTokens(displayTokenArr);
		setTransferAssets(transferAssets);
	}, [selectedAssets, assetAmount]);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="transferCENNZAddressInput">CENNZnet ADDRESS</label>
				<AddressInput
					addressType={"CENNZnet"}
					value={receiveAddress}
					onChange={onTransferCENNZAddressChange}
					id="transferCENNZAddressInput"
					ref={cennzAddressInputRef}
				/>
				{transferableAssets
					?.slice(0, assetAmount.amount)
					?.map((asset, index) => {
						return (
							<TransferAsset
								key={index}
								assetKey={index}
								asset={
									assetAmount.amount === 1 ? asset : displayTokens[index][0]
								}
								tokens={
									displayTokens[index]
										? displayTokens[index]
										: transferableAssets
								}
								selectedAssets={selectedAssets}
								setSelectedAssets={setSelectedAssets}
							/>
						);
					})}
			</div>
			<div css={styles.addRemoveAssets}>
				<StandardButton
					type="button"
					onClick={() => {
						if (assetAmount.amount < transferableAssets?.length)
							setAssetAmount({ amount: assetAmount.amount + 1 });
					}}
				>
					Add Asset
				</StandardButton>
				<StandardButton
					type="button"
					onClick={() => {
						if (assetAmount.amount > 1) {
							setSelectedAssets(
								selectedAssets.slice(0, assetAmount.amount - 1)
							);
							setAssetAmount({ amount: assetAmount.amount - 1 });
						}
					}}
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
	addRemoveAssets: css`
		display: flex;
		justify-content: space-between;
		align-items: center;
	`,
};
