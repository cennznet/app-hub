import { FC, useEffect, useCallback, useMemo } from "react";
import { IntrinsicElements } from "@/libs/types";
import { css } from "@emotion/react";
import { useSwap } from "@/libs/providers/SwapProvider";
import { TokenInput, SwitchButton } from "@/libs/components";
import { Theme } from "@mui/material";
import {
	useSwapExchangeRate,
	useCENNZBalances,
	useBalanceValidation,
} from "@/libs/hooks";
import { Balance } from "@/libs/utils";

interface SwapAssetsPairProps {}

const SwapAssetsPair: FC<IntrinsicElements["div"] & SwapAssetsPairProps> = (
	props
) => {
	const {
		exchangeAssets,
		receiveAssets,
		exchangeSelect,
		receiveSelect,
		exchangeInput,
		receiveInput,
		setReceiveAssets,
		exchangeAsset,
		receiveAsset,
	} = useSwap();

	const { exchangeRate } = useSwapExchangeRate(exchangeInput.value);

	const setTokensPair = useCallback(
		(exchangeTokenId, receiveTokenId = null) => {
			const setExchangeTokenId = exchangeSelect.setTokenId;
			const setReceiveTokenId = receiveSelect.setTokenId;

			setExchangeTokenId(exchangeTokenId);

			const receiveTokens = exchangeAssets.filter(
				(token) => token.assetId !== exchangeTokenId
			);

			setReceiveTokenId((currentTokenId) => {
				const tokenIdToCheck = receiveTokenId || currentTokenId;
				const token = receiveTokens.find(
					(token) => token.assetId === tokenIdToCheck
				);
				if (token) return tokenIdToCheck;
				return receiveTokens[0].assetId;
			});

			setReceiveAssets(receiveTokens);
		},

		[
			exchangeSelect.setTokenId,
			receiveSelect.setTokenId,
			exchangeAssets,
			setReceiveAssets,
		]
	);

	const onSwitchButtonClick = useCallback(() => {
		setTokensPair(receiveSelect.tokenId, exchangeSelect.tokenId);
	}, [setTokensPair, receiveSelect.tokenId, exchangeSelect.tokenId]);

	// Sync up tokens for receive input
	useEffect(() => {
		setTokensPair(exchangeSelect.tokenId);
	}, [exchangeSelect.tokenId, setTokensPair]);

	// Sync up value for receive input
	useEffect(() => {
		const setReceiveValue = receiveInput.setValue;
		if (!exchangeRate || exchangeRate?.eq(0)) return setReceiveValue("");
		setReceiveValue(exchangeRate.toInput());
	}, [exchangeRate, receiveInput.setValue]);

	const [exchangeBalance, receiveBalance] = useCENNZBalances([
		exchangeAsset,
		receiveAsset,
	]);

	const onExchangeMaxRequest = useMemo(() => {
		if (!exchangeBalance) return;
		const setExchangeValue = exchangeInput.setValue;
		return () => setExchangeValue(exchangeBalance.toBalance());
	}, [exchangeBalance, exchangeInput.setValue]);

	const { inputRef: exchangeInputRef } = useBalanceValidation(
		Balance.fromInput(exchangeInput.value, exchangeAsset),
		exchangeBalance
	);

	const { inputRef: receiveInputRef } = useBalanceValidation(
		Balance.fromInput(receiveInput.value, receiveAsset),
		receiveBalance
	);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="exchangeInput">From</label>
				<TokenInput
					onMaxValueRequest={onExchangeMaxRequest}
					selectedTokenId={exchangeSelect.tokenId}
					onTokenChange={exchangeSelect.onTokenChange}
					value={exchangeInput.value}
					onValueChange={exchangeInput.onValueChange}
					tokens={exchangeAssets}
					id="exchangeInput"
					ref={exchangeInputRef}
					required
					scale={exchangeAsset.decimals}
					min={Balance.fromString("1", exchangeAsset).toInput()}
				/>

				{!!exchangeBalance && (
					<div css={styles.tokenBalance}>
						Balance: <span>{exchangeBalance.toBalance()}</span>
					</div>
				)}
			</div>
			<div css={styles.formControl(!!exchangeBalance)}>
				<SwitchButton
					onClick={onSwitchButtonClick}
					vertical={true}
					type="button"
				/>
			</div>
			<div css={styles.formField}>
				<label htmlFor="receiveInput">To</label>
				<TokenInput
					selectedTokenId={receiveSelect.tokenId}
					onTokenChange={receiveSelect.onTokenChange}
					value={receiveInput.value}
					onValueChange={receiveInput.onValueChange}
					tokens={receiveAssets}
					id="receiveInput"
					ref={receiveInputRef}
					readOnly={true}
					required
					scale={receiveAsset.decimals}
					min={Balance.fromString("1", receiveAsset).toInput()}
				/>
				{!!receiveBalance && (
					<div css={styles.tokenBalance}>
						Balance: <span>{receiveBalance.toBalance()}</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default SwapAssetsPair;

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
