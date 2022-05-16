import { VFC, useEffect, useCallback, useMemo } from "react";
import { IntrinsicElements } from "@/types";
import TokenInput from "@/components/shared/TokenInput";
import { css } from "@emotion/react";
import { useSwap } from "@/providers/SwapProvider";
import { Theme } from "@mui/material";
import {
	useCENNZBalances,
	useBalanceValidation,
} from "@/hooks";
import { Balance } from "@/utils";

interface SwapAssetsPairProps {}

const SwapAssetsPair: VFC<IntrinsicElements["div"] & SwapAssetsPairProps> = (
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

	const [exchangeBalance, receiveBalance] = useCENNZBalances(
		exchangeAsset,
		receiveAsset
	);

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
