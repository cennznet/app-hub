import { useEffect, VFC } from "react";
import { IntrinsicElements } from "@/types";
import { LinearProgress, Tooltip, Theme } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { css } from "@emotion/react";
import { formatBalance } from "@/utils";
import { useSwap } from "@/providers/SwapProvider";
import { useSwapExchangeRate, useSwapGasFee } from "@/hooks";

interface SwapStatsProps {}

const SwapStats: VFC<IntrinsicElements["div"] & SwapStatsProps> = ({
	...props
}) => {
	const { exchangeValue, exchangeAsset, receiveAsset, slippage, txStatus } =
		useSwap();

	const [exchangeRate, updateExchangeRate] = useSwapExchangeRate();
	const [gasFee, gasAsset, updateGasFee] = useSwapGasFee();

	useEffect(() => {
		if (txStatus?.status !== "success") return;
		updateExchangeRate();
		updateGasFee();
	}, [txStatus?.status, updateExchangeRate, updateGasFee]);

	return (
		<div {...props} css={styles.root}>
			<LinearProgress
				css={[styles.formInfoProgress(!!exchangeRate && !!gasFee)]}
			/>
			<ul>
				<li>
					<strong>Exchange Rate:</strong>{" "}
					{!!exchangeRate && (
						<span>
							1 {exchangeAsset.symbol} &asymp; {formatBalance(exchangeRate)}{" "}
							{receiveAsset.symbol}
						</span>
					)}
					{!exchangeRate && <span>-</span>}
				</li>
				<li>
					<strong>Gas Fee:</strong>{" "}
					{!!gasFee && (
						<span>
							&asymp;{gasFee} {gasAsset.symbol}
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
								greater than Slippage value, the transaction will not proceed.
								You can update the Slippage percentage under Settings.
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
	);
};

export default SwapStats;

const styles = {
	root: ({ palette }: Theme) => css`
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

	formInfoProgress: (hide: boolean) => css`
		width: 25px;
		border-radius: 10px;
		opacity: ${hide ? 0 : 0.5};
		position: absolute;
		top: 1em;
		right: 1em;
		transition: opacity 0.2s;
	`,

	formInfoTooltip: css`
		max-width: 200px;
	`,
};
