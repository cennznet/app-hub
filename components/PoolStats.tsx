import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { VFC } from "react";
import { LinearProgress, Tooltip, Theme } from "@mui/material";
import { usePool } from "@/providers/PoolProvider";
import { formatBalance } from "@/utils";
import { usePoolGasFee } from "@/hooks";

interface PoolStatsProps {}

const PoolStats: VFC<IntrinsicElements["div"] & PoolStatsProps> = (props) => {
	const {
		tradeAsset,
		coreAsset,
		exchangeRate,
		exchangeInfo,
		updatingExchangeRate,
		tradePoolBalance,
		corePoolBalance,
		updatingPoolBalances,
	} = usePool();

	const userPercentageShare =
		corePoolBalance !== null && exchangeInfo?.coreAssetBalance !== undefined
			? (corePoolBalance / exchangeInfo.coreAssetBalance) * 100
			: null;

	const { gasFee, gasAsset, updatingGasFee } = usePoolGasFee();

	return (
		<div {...props} css={styles.root}>
			<LinearProgress
				css={[
					styles.formInfoProgress(
						updatingExchangeRate || updatingPoolBalances || updatingGasFee
					),
				]}
			/>

			<ul>
				<li>
					<strong>Gas Fee:</strong>{" "}
					{gasFee !== null && (
						<span>
							&asymp; {gasFee} {gasAsset.symbol}
						</span>
					)}
					{gasFee === null && <span>&asymp;</span>}
				</li>
				<li>
					<strong>Exchange Rate:</strong>
					{exchangeRate !== null && (
						<span>
							1 {tradeAsset.symbol} &asymp; {formatBalance(1 / exchangeRate)}{" "}
							{coreAsset.symbol}
						</span>
					)}
					{exchangeRate === null && <span>&asymp;</span>}
				</li>
				<li>
					<strong>Pool Liquidity:</strong>
					{!!exchangeInfo && (
						<span>
							{formatBalance(exchangeInfo.tradeAssetBalance)}{" "}
							{tradeAsset.symbol} +{" "}
							{formatBalance(exchangeInfo.coreAssetBalance)} {coreAsset.symbol}
						</span>
					)}
					{!exchangeInfo && <span>+</span>}
				</li>
				<li>
					<strong>Your Liquidity:</strong>
					{tradePoolBalance !== null && (
						<span>
							{formatBalance(tradePoolBalance)} {tradeAsset.symbol} +{" "}
							{formatBalance(corePoolBalance)} {coreAsset.symbol}
						</span>
					)}
					{tradePoolBalance === null && <span>+</span>}
				</li>
				<li>
					<strong>Your Pool Share:</strong>
					{corePoolBalance !== null && (
						<span>{formatBalance(userPercentageShare)}%</span>
					)}
					{corePoolBalance === null && <span>%</span>}
				</li>
			</ul>
		</div>
	);
};

export default PoolStats;

const styles = {
	root: ({ palette }: Theme) => css`
		margin-top: 2em;
		padding: 1.5em;
		color: ${palette.text.primary};
		background-color: ${palette.background.main};
		position: relative;
		border-radius: 4px;

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
			font-size: 14px;
			&:last-child {
				margin-bottom: 0;
			}

			strong {
				margin-right: 0.5em;
				color: ${palette.primary.main};
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

	formInfoProgress: (show: boolean) => css`
		width: 25px;
		border-radius: 10px;
		opacity: ${show ? 0.5 : 0};
		position: absolute;
		top: 1em;
		right: 1em;
		transition: opacity 0.2s;
	`,

	formInfoTooltip: css`
		max-width: 200px;
	`,
};
