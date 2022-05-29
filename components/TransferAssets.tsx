import { VFC, useState, useEffect, useCallback } from "react";
import { CENNZAssetBalance, ChainOption, IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { useTransfer } from "@/providers/TransferProvider";
import TransferAsset, { TransferAssetType } from "@/components/TransferAsset";
import StandardButton from "@/components/shared/StandardButton";
import AddressInput from "@/components/shared/AddressInput";
import useAddressValidation from "@/hooks/useAddressValidation";
import isEthereumAddress from "@/utils/isEthereumAddress";
import { useTransferableAssets } from "@/hooks";

interface TransferAssetsProps {}

const TransferAssets: VFC<IntrinsicElements["div"] & TransferAssetsProps> = (
	props
) => {
	const {
		setTransferAssets,
		setReceiveAddress,
		receiveAddress,
	} = useTransfer();

	const [assetAmount, setAssetAmount] = useState<{
		amount: number;
		spliceIndex: number;
	}>({
		amount: 1,
		spliceIndex: null,
	});
	const [selectedAssets, setSelectedAssets] = useState<TransferAssetType[]>([]);
	const [dropDownTokens, setDropDownTokens] = useState<CENNZAssetBalance[][]>(
		[]
	);
	const [addressType, setAddressType] = useState<ChainOption>("CENNZnet");
	const [displayAssets, setDisplayAssets] = useState<CENNZAssetBalance[]>([]);

	const transferableAssets = useTransferableAssets();

	useEffect(() => {
		console.info(assetAmount);
		if (!assetAmount.spliceIndex) {
			setDisplayAssets(transferableAssets?.slice(0, assetAmount.amount));
		} else {
			displayAssets.splice(assetAmount.spliceIndex, 1);
			setDisplayAssets(displayAssets);
		}
	}, [assetAmount]);

	useEffect(() => {
		setAssetAmount({ amount: 1, spliceIndex: null });
	}, [transferableAssets]);

	const onTransferCENNZAddressChange = useCallback(
		(event) => {
			const address = event.target.value;
			if (isEthereumAddress(address)) {
				setAddressType("Ethereum");
				setReceiveAddress(address);
			} else {
				setAddressType("CENNZnet");
				setReceiveAddress(address);
			}
		},
		[setReceiveAddress]
	);

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
		const transferAssets: CENNZAssetBalance[] = selectedAssets
			.map((asset) => asset.asset)
			.slice(0, assetAmount.amount);
		setDropDownTokens(displayTokenArr.slice(0, assetAmount.amount));
		setTransferAssets(transferAssets);
	}, [selectedAssets, assetAmount]);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="transferCENNZAddressInput">Transfer Address</label>
				<AddressInput
					placeholder={"Enter a CENNZnet or Ethereum address"}
					addressType={addressType}
					value={receiveAddress}
					onChange={onTransferCENNZAddressChange}
					id="transferCENNZAddressInput"
					ref={cennzAddressInputRef}
				/>
				<label css={styles.assetsLabel}>Assets</label>
				{displayAssets?.map((asset, index) => {
					return (
						<TransferAsset
							key={index}
							assetKey={index}
							asset={
								assetAmount.amount === 1 ? asset : dropDownTokens[index][0]
							}
							tokens={
								dropDownTokens[index]
									? dropDownTokens[index]
									: transferableAssets
							}
							selectedAssets={selectedAssets}
							setSelectedAssets={setSelectedAssets}
							cancelCallback={() => {
								setAssetAmount({
									amount: assetAmount.amount - 1,
									spliceIndex: index,
								});
							}}
						/>
					);
				})}
			</div>
			<div css={styles.addRemoveAssets}>
				<StandardButton
					type="button"
					disabled={
						assetAmount.amount === transferableAssets?.length ||
						!transferableAssets
					}
					onClick={() => {
						if (assetAmount.amount < transferableAssets?.length)
							setAssetAmount({
								amount: assetAmount.amount + 1,
								spliceIndex: null,
							});
					}}
				>
					Add Asset
				</StandardButton>
				<StandardButton
					disabled={assetAmount.amount === 1}
					type="button"
					onClick={() => {
						if (assetAmount.amount > 1) {
							setSelectedAssets(
								selectedAssets.slice(0, assetAmount.amount - 1)
							);
							setAssetAmount({
								amount: assetAmount.amount - 1,
								spliceIndex: null,
							});
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
	assetsLabel: css`
		margin-top: 25px;
	`,
};
