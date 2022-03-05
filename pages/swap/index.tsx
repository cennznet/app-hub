import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchSwapAssets from "@/utils/fetchSwapAssets";
import { css } from "@emotion/react";
import { Theme, CircularProgress } from "@mui/material";
import useTokensFetcher from "@/hooks/useTokensFetcher";
import TokenInput from "@/components/shared/TokenInput";
import useTokenInput from "@/hooks/useTokenInput";
import { useCallback, useEffect, useMemo, useState } from "react";
import SwapButton from "@/components/shared/SwapButton";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { formatBalance, getBuyAssetExtrinsic } from "@/utils";
import useSwapExchangeRate from "@/hooks/useSwapExchangeRate";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import useGasFee from "@/hooks/useGasFee";

export async function getStaticProps() {
	const api = await Api.create({ provider: process.env.NEXT_PUBLIC_API_URL });

	return {
		props: {
			defaultAssets: await fetchSwapAssets(api),
		},
	};
}

const CENNZ_ASSET_ID = Number(process.env.NEXT_PUBLIC_CENNZ_ID);
const CPAY_ASSET_ID = Number(process.env.NEXT_PUBLIC_CPAY_ID);

const Swap: React.FC<{ defaultAssets: CENNZAsset[] }> = ({ defaultAssets }) => {
	const { api } = useCENNZApi();
	const { selectedAccount, balances } = useCENNZWallet();
	const [exchangeTokens] = useTokensFetcher<CENNZAsset[]>(
		fetchSwapAssets,
		defaultAssets
	);
	const [receiveTokens, setReceiveTokens] =
		useState<CENNZAsset[]>(exchangeTokens);

	const cennzAsset = exchangeTokens?.find(
		(token) => token.assetId === CENNZ_ASSET_ID
	);
	const cpayAsset = exchangeTokens?.find(
		(token) => token.assetId === CPAY_ASSET_ID
	);

	const [exchangeToken, exchangeValue] = useTokenInput(cennzAsset.assetId);
	const [receiveToken, receiveValue] = useTokenInput(cpayAsset.assetId);

	const exchangeAsset = exchangeTokens?.find(
		(token) => token.assetId === exchangeToken.tokenId
	);
	const receiveAsset = exchangeTokens?.find(
		(token) => token.assetId === receiveToken.tokenId
	);

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

		[exchangeToken.setTokenId, receiveToken.setTokenId, exchangeTokens]
	);

	const onSwapButtonClick = useCallback(() => {
		setTokensPair(receiveToken.tokenId, exchangeToken.tokenId);
	}, [setTokensPair, receiveToken.tokenId, exchangeToken.tokenId]);

	// Sync up tokens for receive input
	useEffect(() => {
		setTokensPair(exchangeToken.tokenId);
	}, [exchangeToken.tokenId, setTokensPair]);

	const [exchangeBalance, setExchangeBalance] = useState<number>(null);
	const [receiveBalance, setReceiveBalance] = useState<number>(null);

	// Update asset balances for both send and receive assets
	useEffect(() => {
		if (!balances?.length) {
			setExchangeBalance(null);
			setReceiveBalance(null);
			return;
		}

		const sendBalance = balances.find(
			(balance) => balance.assetId === exchangeToken.tokenId
		);

		const receiveBalance = balances.find(
			(balance) => balance.assetId === receiveToken.tokenId
		);

		setExchangeBalance(sendBalance.value);
		setReceiveBalance(receiveBalance.value);
	}, [balances, exchangeToken.tokenId, receiveToken.tokenId]);

	const exchangeRate = useSwapExchangeRate(
		exchangeToken.tokenId,
		receiveToken.tokenId,
		exchangeTokens
	);

	useEffect(() => {
		const setValue = receiveValue.setValue;
		if (!exchangeValue.value) return setValue("");
		setValue((Number(exchangeValue.value) * exchangeRate).toString());
	}, [exchangeRate, exchangeValue.value, receiveValue.setValue]);

	const [slippage, setSlippage] = useState<string>("5");
	const swapExtrinsic = useMemo(() => {
		if (!api) return;

		return getBuyAssetExtrinsic(
			api,
			exchangeAsset,
			exchangeValue.value || "0",
			receiveAsset,
			receiveValue.value || "0",
			Number(slippage)
		);
	}, [
		api,
		exchangeAsset,
		exchangeValue.value,
		receiveAsset,
		receiveValue.value,
		slippage,
	]);
	const [gasFee, gasAsset] = useGasFee(swapExtrinsic);

	return (
		<div css={styles.root}>
			<h1 css={styles.heading}>SWAP</h1>
			<form css={styles.form}>
				<div css={styles.formField}>
					<label>You Send</label>
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
					/>

					{!!selectedAccount && (
						<div css={styles.tokenBalance}>
							Balance:{" "}
							{exchangeBalance !== null && (
								<span>{formatBalance(exchangeBalance)}</span>
							)}
							{exchangeBalance === null && <CircularProgress size="0.75em" />}
						</div>
					)}
				</div>

				<div css={[styles.formField, styles.formControl]}>
					<SwapButton
						onClick={onSwapButtonClick}
						vertical={true}
						type="button"
					/>
				</div>

				<div css={styles.formField}>
					<label>You Get</label>
					<TokenInput
						selectedTokenId={receiveToken.tokenId}
						onTokenChange={receiveToken.onTokenChange}
						value={
							receiveValue.value
								? formatBalance(Number(receiveValue.value))
								: ""
						}
						onValueChange={receiveValue.onValueChange}
						tokens={receiveTokens}
						disabled={true}
					/>
					{!!selectedAccount && (
						<div css={styles.tokenBalance}>
							Balance:{" "}
							{receiveBalance !== null && (
								<span>{formatBalance(receiveBalance)}</span>
							)}
							{receiveBalance === null && <CircularProgress size="0.75em" />}
						</div>
					)}
				</div>

				<ul css={[styles.formField, styles.formInfo]}>
					<li>
						<strong>Exchange Rate:</strong>{" "}
						{!!exchangeRate && (
							<span>
								1 {exchangeAsset.symbol} = {formatBalance(exchangeRate)}{" "}
								{receiveAsset.symbol}
							</span>
						)}
						{!exchangeRate && <CircularProgress size="0.75em" />}
					</li>
					<li>
						<strong>Gas Fee: </strong>{" "}
						{!!gasFee && (
							<span>
								{gasFee} {gasAsset.symbol}
							</span>
						)}
						{!gasFee && <CircularProgress size="0.75em" />}
					</li>
				</ul>
			</form>
		</div>
	);
};

export default Swap;

const styles = {
	root: css`
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 550px;
		border-radius: 4px;
		margin: 0 auto 5em;
		position: relative;
		background-color: #ffffff;
		box-shadow: 4px 8px 8px rgba(17, 48, 255, 0.1);
		padding: 1.5em 2.5em 2.5em;
	`,

	heading: ({ palette }: Theme) => css`
		font-weight: bold;
		font-size: 20px;
		line-height: 1;
		text-align: center;
		text-transform: uppercase;
		color: ${palette.primary.main};
	`,

	form: css`
		width: 100%;
		margin-top: 1.5em;
	`,

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
		text-align: center;
	`,

	tokenBalance: ({ palette }: Theme) => css`
		margin-top: 0.5em;
		font-weight: 500;

		span {
			font-family: "Roboto Mono", monospace;
			color: ${palette.text.primary};
		}
	`,

	formInfo: ({ palette }: Theme) => css`
		margin-top: 2em;
		padding: 1.5em;
		color: ${palette.primary.main};
		list-style: none;
		position: relative;

		&:before {
			content: "";
			background-color: ${palette.info.main};
			opacity: 0.4;
			position: absolute;
			inset: 0;
		}

		li {
			position: relative;
			margin-bottom: 0.5em;
			&:last-child {
				margin-bottom: 0;
			}
		}

		span {
			font-family: "Roboto Mono", monospace;
			color: ${palette.text.primary};
		}
	`,
};
