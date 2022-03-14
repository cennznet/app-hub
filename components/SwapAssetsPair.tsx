import { VFC, useEffect, useCallback } from "react";
import { IntrinsicElements } from "@/types";
import TokenInput from "@/components/shared/TokenInput";
import { css } from "@emotion/react";
import { useSwap } from "@/providers/SwapProvider";
import { formatBalance } from "@/utils";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import SwitchButton from "@/components/shared/SwitchButton";
import { Theme } from "@mui/material";

import { useSwapExchangeRate } from "@/hooks";

interface SwapAssetsPairProps {}

const SwapAssetsPair: VFC<IntrinsicElements["div"] & SwapAssetsPairProps> = (
	props
) => {
	const {
		exchangeTokens,
		receiveTokens,
		exchangeToken,
		receiveToken,
		exchangeValue,
		receiveValue,
		setReceiveTokens,
		exchangeBalance,
		receiveBalance,
	} = useSwap();

	const { selectedAccount } = useCENNZWallet();

	const [exchangeRate] = useSwapExchangeRate(exchangeValue.value);

	const setTokensPair = useCallback(
		(exchangeTokenId, receiveTokenId = null) => {
			const setExchangeTokenId = exchangeToken.setTokenId;
			const setReceiveTokenId = receiveToken.setTokenId;

			setExchangeTokenId(exchangeTokenId);

			const receiveTokens = exchangeTokens.filter(
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

			setReceiveTokens(receiveTokens);
		},

		[
			exchangeToken.setTokenId,
			receiveToken.setTokenId,
			exchangeTokens,
			setReceiveTokens,
		]
	);

	const onSwitchButtonClick = useCallback(() => {
		setTokensPair(receiveToken.tokenId, exchangeToken.tokenId);
	}, [setTokensPair, receiveToken.tokenId, exchangeToken.tokenId]);

	// Sync up tokens for receive input
	useEffect(() => {
		setTokensPair(exchangeToken.tokenId);
	}, [exchangeToken.tokenId, setTokensPair]);

	// Sync up value for receive input
	useEffect(() => {
		const setReceiveValue = receiveValue.setValue;
		if (!exchangeRate) return setReceiveValue("");
		setReceiveValue(exchangeRate.toString());
	}, [exchangeRate, receiveValue.setValue]);

	const reValue = Number(receiveValue.value);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="exchangeInput">You Send</label>
				<TokenInput
					onMaxValueRequest={
						!!exchangeBalance
							? () => exchangeValue.setValue(formatBalance(exchangeBalance))
							: null
					}
					selectedTokenId={exchangeToken.tokenId}
					onTokenChange={exchangeToken.onTokenChange}
					value={exchangeValue.value}
					onValueChange={exchangeValue.onValueChange}
					tokens={exchangeTokens}
					id="exchangeInput"
					required
					scale={4}
					min={0.0001}
					max={Number(exchangeBalance)}
				/>

				{!!selectedAccount && (
					<div css={styles.tokenBalance}>
						Balance:{" "}
						<span>
							{formatBalance(exchangeBalance !== null ? exchangeBalance : 0)}
						</span>
					</div>
				)}
			</div>
			<div css={styles.formControl}>
				<SwitchButton
					onClick={onSwitchButtonClick}
					vertical={true}
					type="button"
				/>
			</div>
			<div css={styles.formField}>
				<label htmlFor="receiveInput">You Get</label>
				<TokenInput
					selectedTokenId={receiveToken.tokenId}
					onTokenChange={receiveToken.onTokenChange}
					value={reValue ? formatBalance(reValue) : ""}
					onValueChange={receiveValue.onValueChange}
					tokens={receiveTokens}
					disabled={true}
					id="receiveInput"
				/>
				{!!selectedAccount && (
					<div css={styles.tokenBalance}>
						Balance:{" "}
						<span>
							{formatBalance(exchangeBalance !== null ? receiveBalance : 0)}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default SwapAssetsPair;

const styles = {
	root: css``,

	formField: css`
		margin-bottom: 1em;

		label {
			font-weight: bold;
			font-size: 0.875em;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
		}
	`,

	formControl: css`
		margin-top: 1em;
		text-align: center;
	`,

	tokenBalance: ({ palette }: Theme) => css`
		margin-top: 0.5em;
		font-weight: 500;
		color: ${palette.grey["700"]};

		span {
			font-family: "Roboto Mono", monospace;
			font-size: 14px;
			font-weight: bold;
		}
	`,
};
