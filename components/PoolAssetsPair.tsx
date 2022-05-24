import { usePool } from "@/providers/PoolProvider";
import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { FC, useMemo, useEffect, memo } from "react";
import TokenInput from "@/components/shared/TokenInput";
import {
	useCENNZBalances,
	usePoolCoreAssetValue,
	useBalanceValidation,
} from "@/hooks";
import { Theme, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Balance } from "@/utils";

interface PoolAssetsPairProps {}

const PoolAssetsPair: FC<IntrinsicElements["div"] & PoolAssetsPairProps> = (
	props
) => {
	const {
		poolAction,
		tradeAssets,
		tradeAsset,
		tradeSelect,
		tradeInput,
		coreAsset,
		coreSelect,
		coreInput,
		userInfo,
	} = usePool();

	const tradePoolBalance = userInfo?.tradeAssetBalance ?? null;
	const corePoolBalance = userInfo?.coreAssetBalance ?? null;

	const [tradeWalletBalance, coreWalletBalance] = useCENNZBalances(
		tradeAsset,
		coreAsset
	);

	const tradeBalance =
		poolAction === "Remove" ? tradePoolBalance : tradeWalletBalance;
	const coreBalance =
		poolAction === "Remove" ? corePoolBalance : coreWalletBalance;

	const onTradeAssetMaxRequest = useMemo(() => {
		const setTradeValue = tradeInput.setValue;
		return () => setTradeValue(tradeBalance.toInput());
	}, [tradeBalance, tradeInput.setValue]);

	const { coreAssetValue } = usePoolCoreAssetValue(tradeInput.value);

	// Update coreAsset value by tradeAsset value
	useEffect(() => {
		const setCoreValue = coreInput.setValue;
		if (!coreAssetValue || coreAssetValue.eq(0)) return setCoreValue("");
		setCoreValue(coreAssetValue.toInput());
	}, [coreAssetValue, coreInput.setValue]);

	const { inputRef: tradeInputRef } = useBalanceValidation(
		Balance.fromInput(tradeInput.value, tradeAsset),
		tradeBalance
	);

	const { inputRef: coreInputRef } = useBalanceValidation(
		Balance.fromInput(coreInput.value, coreAsset),
		coreBalance
	);

	return (
		<div {...props} css={styles.root}>
			<div css={styles.formField}>
				<label htmlFor="tradeInput">Liquidity Asset</label>
				<TokenInput
					onMaxValueRequest={onTradeAssetMaxRequest}
					selectedTokenId={tradeSelect.tokenId}
					onTokenChange={tradeSelect.onTokenChange}
					value={tradeInput.value}
					onValueChange={tradeInput.onValueChange}
					tokens={tradeAssets}
					id="tradeInput"
					ref={tradeInputRef}
					required
					scale={tradeAsset.decimals}
					min={Balance.fromString("1", tradeAsset).toInput()}
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
					selectedTokenId={coreSelect.tokenId}
					onTokenChange={coreSelect.onTokenChange}
					value={coreInput.value}
					onValueChange={coreInput.onValueChange}
					tokens={[coreAsset]}
					required
					scale={coreAsset.decimals}
					min={Balance.fromString("1", coreAsset).toInput()}
					max={coreBalance?.gt(0) ? coreBalance.toBalance() : null}
					ref={coreInputRef}
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
										To keep the liquidity pool balanced, deposits require an
										equal value of <strong>{tradeAsset.symbol}</strong> and{" "}
										<strong>{coreAsset.symbol}</strong> at the current exchange
										rate.
									</div>
								)}

								{poolAction === "Remove" && (
									<div>
										To keep the liquidity pool balanced, withdrawals will return
										an equal value of <strong>{tradeAsset.symbol}</strong> and{" "}
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

export default memo(PoolAssetsPair);

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
			letter-spacing: -0.025em;
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
