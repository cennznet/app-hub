import { useBridgeGasFee, useBridgeVerificationFee } from "@/hooks";
import { useBridge } from "@/providers/BridgeProvider";
import { IntrinsicElements } from "@/types";
import { css, LinearProgress, Theme } from "@mui/material";
import { FC, memo } from "react";

interface BridgeStatsProps {}

const BridgeStats: FC<IntrinsicElements["div"] & BridgeStatsProps> = (
	props
) => {
	const { gasFee, updatingGasFee } = useBridgeGasFee();
	const { verificationFee, updatingVerificationFee } =
		useBridgeVerificationFee();
	const { bridgeAction } = useBridge();

	return (
		<div {...props} css={styles.root}>
			{bridgeAction === "Withdraw" && (
				<LinearProgress
					css={[
						styles.formInfoProgress(updatingGasFee || updatingVerificationFee),
					]}
				/>
			)}

			<ul>
				{bridgeAction === "Deposit" && (
					<li>
						<strong>Gas Fee:</strong> Estimated by MetaMask
					</li>
				)}

				{bridgeAction === "Withdraw" && (
					<li>
						<strong>Gas Fee:</strong>{" "}
						{gasFee?.gt(0) && (
							<span>
								&asymp; {gasFee.toBalance()} {gasFee.getSymbol()}
							</span>
						)}
						{!gasFee?.gt(0) && <span>&asymp;</span>}
					</li>
				)}
				{bridgeAction === "Withdraw" && (
					<li>
						<strong>Verification Fee:</strong>{" "}
						{verificationFee?.gt(0) && (
							<span>
								&asymp; {verificationFee.toBalance()}{" "}
								{verificationFee.getSymbol()}
							</span>
						)}
						{!verificationFee?.gt(0) && <span>&asymp;</span>}
					</li>
				)}
			</ul>
		</div>
	);
};

export default memo(BridgeStats);

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
};
