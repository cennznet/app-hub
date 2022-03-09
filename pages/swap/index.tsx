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
import { CENNZ_ASSET_ID, CPAY_ASSET_ID, API_URL } from "@/constants";
import ExpandLess from "@mui/icons-material/ExpandLess";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SubmitButton from "@/components/shared/SubmitButton";
import signAndSendTx from "@/utils/signAndSendTx";
import { useGlobalModal } from "@/providers/GlobalModalProvider";
import generateGlobalProps from "@/utils/generateGlobalProps";
import SwapForm from "@/components/SwapForm";
import SwapAssetsPair from "@/components/SwapAssetsPair";
import SwapStats from "@/components/SwapStats";
import SwapSettings from "@/components/SwapSettings";
import SwapProvider from "@/providers/SwapProvider";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			supportedAssets: await fetchSwapAssets(api),
			...(await generateGlobalProps("swap")),
		},
	};
}

const Swap: React.FC<{ supportedAssets: CENNZAsset[] }> = ({
	supportedAssets,
}) => {
	return (
		<SwapProvider supportedAssets={supportedAssets}>
			<div css={styles.root}>
				<h1 css={styles.heading}>SWAP</h1>

				<SwapForm>
					<SwapAssetsPair />
					<SwapStats />
					<SwapSettings />
				</SwapForm>
			</div>
		</SwapProvider>
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
		overflow: hidden;
	`,

	heading: ({ palette }: Theme) => css`
		font-weight: bold;
		font-size: 20px;
		line-height: 1;
		text-align: center;
		text-transform: uppercase;
		color: ${palette.primary.main};
		margin-bottom: 1.5em;
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

	formSubmit: ({ palette }: Theme) => css`
		text-align: center;
		border-top: 1px solid ${palette.text.disabled};
		padding-top: 2em;
	`,

	formProgress:
		(show: boolean) =>
		({ transitions }: Theme) =>
			css`
				position: absolute;
				inset: 0;
				background-color: rgba(255, 255, 255, 0.9);
				z-index: 100;
				opacity: ${show ? 1 : 0};
				pointer-events: ${show ? "all" : "none"};
				transition: opacity ${transitions.duration.short}ms;
				display: flex;
				align-items: center;
				justify-content: center;
				backdrop-filter: blur(2px);
				padding: 5em;
				text-align: center;
				font-size: 14px;
			`,

	formProgressBar: css`
		border-radius: 10px;
		height: 10px;
		margin: 2em;
	`,

	highlightText: ({ palette }: Theme) => css`
		color: ${palette.text.highlight};
	`,
};
