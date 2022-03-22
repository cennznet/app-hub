import { usePool } from "@/providers/PoolProvider";
import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { VFC, useMemo, useEffect, useRef } from "react";
import TokenInput from "@/components/shared/TokenInput";
import { useWalletBalances, usePoolCoreAssetValue } from "@/hooks";
import { Theme, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface PoolAssetsPairProps {}

const PoolAssetsPair: VFC<IntrinsicElements["div"] & PoolAssetsPairProps> = (
	props
) => {
	const {
		poolAction,
		tradeAssets,
		tradeAsset,
		tradeToken,
		tradeValue,
		coreAsset,
		coreToken,
		coreValue,
		userInfo,
	} = usePool();

	const tradePoolBalance = userInfo?.tradeAssetBalance ?? null;
	const corePoolBalance = userInfo?.coreAssetBalance ?? null;

	const [tradeWalletBalance, coreWalletBalance] = useWalletBalances(
		tradeAsset,
		coreAsset
	);

	const tradeBalance =
		poolAction === "Remove" ? tradePoolBalance : tradeWalletBalance;
	const coreBalance =
		poolAction === "Remove" ? corePoolBalance : coreWalletBalance;

	const onTradeAssetMaxRequest = useMemo(() => {
		const setTradeValue = tradeValue.setValue;
		return () => setTradeValue(tradeBalance.toInput());
	}, [tradeBalance, tradeValue.setValue]);

	const { coreAssetValue } = usePoolCoreAssetValue(tradeValue.value);

	// Update coreAsset value by tradeAsset value
	useEffect(() => {
		const setCoreValue = coreValue.setValue;
		if (!coreAssetValue || coreAssetValue.eq(0)) return setCoreValue("");
		setCoreValue(coreAssetValue.toInput());
	}, [coreAssetValue, coreValue.setValue]);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="tradeInput">Liquidity Asset</label>
				<TokenInput
					onMaxValueRequest={onTradeAssetMaxRequest}
					selectedTokenId={tradeToken.tokenId}
					onTokenChange={tradeToken.onTokenChange}
					value={tradeValue.value}
					onValueChange={tradeValue.onValueChange}
					tokens={tradeAssets}
					id="tradeInput"
					required
					scale={4}
					min={0.0001}
					max={tradeBalance?.gt(0) ? tradeBalance.toInput() : null}
				/>

				{!!tradeBalance && poolAction === "Add" && (
					<div css={styles.tokenBalance}>
						Balance: <span>{tradeBalance.toBalance()}</span>
					</div>
				)}

				{!!tradeBalance && poolAction === "Remove" && (
					<div css={styles.tokenBalance}>
						Withdrawable: <span>{tradeBalance.toBalance()}</span>
					</div>
				)}
			</div>

			<div css={styles.formField}>
				<TokenInput
					selectedTokenId={coreToken.tokenId}
					onTokenChange={coreToken.onTokenChange}
					value={coreValue.value}
					onValueChange={coreValue.onValueChange}
					tokens={[coreAsset]}
					required
					scale={4}
					min={0.0001}
					max={coreBalance?.gt(0) ? coreBalance.toBalance() : null}
				>
					<Tooltip
						css={styles.inputTooltip}
						disableFocusListener
						PopperProps={
							{
								sx: styles.inputTooltipPopper,
							} as any
						}
						title={
							<>
								{poolAction === "Add" && (
									<div>
										To keep the liquidity pool functional, deposits require an
										equal value of <strong>{tradeAsset.symbol}</strong> and{" "}
										<strong>{coreAsset.symbol}</strong> at the current exchange
										rate.
									</div>
								)}

								{poolAction === "Remove" && (
									<div>
										To keep the liquidity pool functional, withdrawals will
										return an equal value of{" "}
										<strong>{tradeAsset.symbol}</strong> and{" "}
										<strong>{coreAsset.symbol}</strong> at the current exchange
										rate.
									</div>
								)}
							</>
						}
						arrow
						placement="right"
					>
						<HelpOutlineIcon fontSize={"0.5em" as any} />
					</Tooltip>
				</TokenInput>

				{!!coreBalance && poolAction === "Add" && (
					<div css={styles.tokenBalance}>
						Balance: <span>{coreBalance.toBalance()}</span>
					</div>
				)}

				{!!coreBalance && poolAction === "Remove" && (
					<div css={styles.tokenBalance}>
						Withdrawable: <span>{coreBalance.toBalance()}</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default PoolAssetsPair;

const styles = {
	root: css``,

	formField: ({ palette }: Theme) => css`
		margin-bottom: 1.5em;

		&:last-child {
			margin-bottom: 0;
		}

		label {
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	tokenBalance: ({ palette }: Theme) => css`
		margin-top: 0.25em;
		font-weight: 500;
		color: ${palette.grey["700"]};
		font-size: 14px;

		span {
			font-family: "Roboto Mono", monospace;
			font-weight: bold;
		}
	`,

	inputTooltip: ({ palette }: Theme) => css`
		position: absolute;
		left: 108px;
		cursor: pointer;
		&:hover {
			color: ${palette.primary.main};
		}
	`,

	inputTooltipPopper: css`
		max-width: 200px;
	`,
};
