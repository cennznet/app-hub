import { IntrinsicElements } from "@/libs/types";
import { css } from "@emotion/react";
import { FC, memo } from "react";
import { LinearProgress, Tooltip, Theme } from "@mui/material";
import { usePool } from "@providers/PoolProvider";
import { Balance } from "@utils";
import {
	usePoolGasFee,
	usePoolCoreAssetValue,
	useSelectedAccount,
} from "@hooks";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface PoolStatsProps {}

const PoolStats: FC<IntrinsicElements["div"] & PoolStatsProps> = (props) => {
	const {
		tradeAsset,
		tradeInput,
		coreAsset,
		exchangeInfo,
		updatingExchangeInfo,
		userInfo,
		updatingPoolUserInfo,
		slippage,
		poolAction,
	} = usePool();

	const tradeAssetBalance = userInfo?.tradeAssetBalance ?? null;
	const coreAssetBalance = userInfo?.coreAssetBalance ?? null;

	const tradeAssetReserve = exchangeInfo?.tradeAssetReserve ?? null;
	const coreAssetReserve = exchangeInfo?.coreAssetReserve ?? null;

	const userPercentageShare =
		coreAssetBalance !== null &&
		coreAssetReserve !== null &&
		coreAssetReserve.gt(0)
			? coreAssetBalance.div(coreAssetReserve).mul(100).toNumber()
			: null;

	const { gasFee, updatingGasFee } = usePoolGasFee();

	const { coreAssetValue } = usePoolCoreAssetValue("1");

	const selectedAccount = useSelectedAccount();

	return (
		<div {...props} css={styles.root}>
			<LinearProgress
				css={[
					styles.formInfoProgress(
						updatingExchangeInfo || updatingPoolUserInfo || updatingGasFee
					),
				]}
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
					<strong>Exchange Rate:</strong>
					{coreAssetValue !== null && (
						<span>
							1 {tradeAsset.symbol} &asymp; {coreAssetValue.toBalance()}{" "}
							{coreAsset.symbol}
						</span>
					)}
					{coreAssetValue === null && <span>&asymp;</span>}
				</li>
				<li>
					<strong>Pool Liquidity:</strong>
					{tradeAssetReserve !== null && (
						<span>
							{`${tradeAssetReserve.toBalance({
								withSymbol: true,
							})} + ${coreAssetReserve?.toBalance({ withSymbol: true })}`}
						</span>
					)}
					{tradeAssetReserve === null && <span>+</span>}
				</li>
				{!!selectedAccount?.address && (
					<li>
						<strong>Your Liquidity:</strong>
						{tradeAssetBalance !== null && (
							<span>
								{`${tradeAssetBalance.toBalance({
									withSymbol: true,
								})} + ${coreAssetBalance.toBalance({ withSymbol: true })}`}
							</span>
						)}
						{tradeAssetBalance === null && <span>+</span>}
					</li>
				)}
				{!!selectedAccount?.address && (
					<li>
						<strong>Your Pool Share:</strong>
						{userPercentageShare !== null && (
							<span>{userPercentageShare.toFixed(2)}%</span>
						)}
						{userPercentageShare === null && <span>%</span>}
					</li>
				)}
				<li>
					<strong>Slippage:</strong>{" "}
					{poolAction === "Add" && (
						<span>
							{"<= "}
							{Balance.fromInput(tradeInput?.value, tradeAsset)
								.increase(slippage)
								.toBalance()}{" "}
							{tradeAsset.symbol}
						</span>
					)}
					{poolAction === "Remove" && (
						<span>
							{">= "}
							{Balance.fromInput(tradeInput?.value, tradeAsset)
								.decrease(slippage)
								.toBalance()}{" "}
							{tradeAsset.symbol}
						</span>
					)}
					<Tooltip
						disableFocusListener
						PopperProps={
							{
								sx: styles.formInfoTooltip,
							} as any
						}
						title={
							<div>
								If the amount of <strong>{tradeAsset.symbol}</strong> used for
								liquidity pool is {poolAction === "Remove" ? "less" : "greater"}{" "}
								than Slippage value, the transaction will fail. You can update
								your preferred Slippage percentage under Settings.
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

export default memo(PoolStats);

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
