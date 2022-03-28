import { useEffect, VFC } from "react";
import { IntrinsicElements } from "@/types";
import { LinearProgress, Tooltip, Theme } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { css } from "@emotion/react";
import { Balance } from "@/utils";
import { useSwap } from "@/providers/SwapProvider";
import { useSwapExchangeRate, useSwapGasFee } from "@/hooks";

interface SwapStatsProps {}

const SwapStats: VFC<IntrinsicElements["div"] & SwapStatsProps> = (props) => {
	const { exchangeInput, exchangeAsset, receiveAsset, slippage, txStatus } =
		useSwap();

	const { exchangeRate, updatingExchangeRate, updateExchangeRate } =
		useSwapExchangeRate("1");
	const { gasFee, updatingGasFee, updateGasFee } = useSwapGasFee();

	useEffect(() => {
		if (txStatus?.status !== "success") return;
		updateExchangeRate();
		updateGasFee();
	}, [txStatus?.status, updateExchangeRate, updateGasFee]);

	return (
		<div {...props} css={styles.root}>
			<LinearProgress
				css={[styles.formInfoProgress(updatingGasFee || updatingExchangeRate)]}
			/>
			<ul>
				<li>
					<strong>Gas Fee:</strong>{" "}
					{gasFee?.gt(0) && (
						<span>
							&asymp; {gasFee.toBalance()} {gasFee.getSymbol()}
						</span>
					)}
					{!gasFee?.gt(0) && <span>&asymp;</span>}
				</li>
				<li>
					<strong>Exchange Rate:</strong>{" "}
					{exchangeRate !== null && (
						<span>
							1 {exchangeAsset.symbol} &asymp; {exchangeRate.div(1).toBalance()}{" "}
							{receiveAsset.symbol}
						</span>
					)}
					{exchangeRate === null && <span>&asymp;</span>}
				</li>

				<li>
					<strong>Slippage:</strong>{" "}
					<span>
						{Balance.fromInput(exchangeInput?.value, exchangeAsset)
							.increase(slippage)
							.toBalance()}{" "}
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
								If the amount of <strong>{exchangeAsset.symbol}</strong> used
								for swapping is greater than Slippage value, the transaction
								will not proceed. You can update the Slippage percentage under
								Settings.
							</div>
						}
						arrow
						placement="right"
					>
						<HelpOutlineIcon fontSize={"0.5em" as any} />
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
				letter-spacing: -0.025em;
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
