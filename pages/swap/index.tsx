import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchSwapAssets from "@/utils/fetchSwapAssets";
import { css } from "@emotion/react";
import {
	Theme,
	CircularProgress,
	LinearProgress,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	TextField,
	InputAdornment,
	Tooltip,
} from "@mui/material";
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
import { CENNZ_ASSET_ID, CPAY_ASSET_ID } from "@/constants";
import ExpandLess from "@mui/icons-material/ExpandLess";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export async function getStaticProps() {
	const api = await Api.create({ provider: process.env.NEXT_PUBLIC_API_URL });

	return {
		props: {
			defaultAssets: await fetchSwapAssets(api),
		},
	};
}

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
					<label htmlFor="receiveInput">You Get</label>
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
						id="receiveInput"
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
				<div css={[styles.formField, styles.formInfo]}>
					<LinearProgress
						css={[styles.formInfoProgress(!!exchangeRate && !!gasFee)]}
					/>
					<ul>
						<li>
							<strong>Exchange Rate:</strong>{" "}
							{!!exchangeRate && (
								<span>
									1 {exchangeAsset.symbol} = {formatBalance(exchangeRate)}{" "}
									{receiveAsset.symbol}
								</span>
							)}
							{!exchangeRate && <span>-</span>}
						</li>
						<li>
							<strong>Gas Fee:</strong>{" "}
							{!!gasFee && (
								<span>
									{gasFee} {gasAsset.symbol}
								</span>
							)}
							{!gasFee && <span>-</span>}
						</li>
						<li>
							<strong>Slippage:</strong>{" "}
							<span>
								{formatBalance(
									Number(exchangeValue.value) * (1 + Number(slippage) / 100)
								)}{" "}
								{exchangeAsset.symbol}
							</span>
							<Tooltip
								disableFocusListener
								PopperProps={
									{
										sx: styles.formInfoTooltip,
									} as any
								}
								title={
									<div>
										If the amount of {exchangeAsset.symbol} used for swapping is
										greater than Slippage value, the transaction will not
										proceed. You can update the Slippage percentage under
										Settings.
									</div>
								}
								arrow
								placement="right"
							>
								<InfoOutlinedIcon fontSize={"0.5em" as any} />
							</Tooltip>
						</li>
					</ul>
				</div>
				<Accordion css={[styles.formSettings]}>
					<AccordionSummary
						css={styles.formSettingsSummary}
						expandIcon={<ExpandLess />}
					>
						Settings
					</AccordionSummary>
					<AccordionDetails>
						<div css={styles.formField}>
							<label htmlFor="slippageInput">Slippage</label>
							<TextField
								css={styles.slippageInput}
								value={slippage}
								onChange={(event) => setSlippage(event.target.value)}
								required
								type="number"
								inputProps={{
									min: 0,
									max: 100,
								}}
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">%</InputAdornment>
									),
								}}
							/>
						</div>
					</AccordionDetails>
				</Accordion>
			</form>
		</div>
	);
};

export default Swap;

const styles = {
	root: ({ shadows }: Theme) => css`
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 550px;
		border-radius: 4px;
		margin: 0 auto 5em;
		position: relative;
		background-color: #ffffff;
		box-shadow: ${shadows[1]};
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
		color: ${palette.text.primary};
		background-color: ${palette.background.main};
		position: relative;

		ul {
			list-style: none;
			margin: 0;
			padding: 0;
		}

		p {
			position: relative;
		}

		li {
			position: relative;
			margin-bottom: 0.5em;
			display: flex;
			align-items: center;
			&:last-child {
				margin-bottom: 0;
			}

			strong {
				margin-right: 0.25em;
				color: ${palette.text.highlight};
				display: flex;
				align-items: center;
			}

			span {
				font-family: "Roboto Mono", monospace;
			}

			svg {
				display: inline-block;
				margin-left: 0.5em;
				cursor: pointer;
				&:hover {
					color: ${palette.primary.main};
				}
			}
		}

		pre {
			display: inline;
		}
	`,

	formInfoProgress: (hide) => css`
		width: 25px;
		border-radius: 10px;
		opacity: ${hide ? 0 : 0.5};
		position: absolute;
		top: 1em;
		right: 1em;
		transition: opacity 0.2s;
	`,

	formSettings: css`
		box-shadow: none;

		&:before {
			display: none;
		}
	`,

	formSettingsSummary: ({ palette }: Theme) => css`
		text-transform: uppercase;
		font-weight: bold;
		padding: 0;
		justify-content: flex-start;

		.MuiAccordionSummary-content {
			flex-grow: 0;
			margin-right: 0.125em;
		}

		.MuiAccordionSummary-expandIconWrapper.Mui-expanded {
			color: ${palette.primary.main};
		}
	`,

	slippageInput: css`
		width: 200px;
	`,

	formInfoTooltip: css`
		max-width: 200px;
	`,
};
