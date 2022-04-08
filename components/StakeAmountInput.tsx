import { useMemo, VFC } from "react";
import { css } from "@emotion/react";
import TokenInput from "@/components/shared/TokenInput";
import { useStake } from "@/providers/StakeProvider";
import { useBalanceValidation, useCENNZBalances } from "@/hooks";
import { Balance } from "@/utils";
import { IntrinsicElements } from "@/types";
import { LinearProgress, Theme, Tooltip } from "@mui/material";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface StakeAmountInputProps {}

const StakeAmountInput: VFC<
	IntrinsicElements["div"] & StakeAmountInputProps
> = (props) => {
	const { stakingAsset, stakeAction, stakeAmountInput } = useStake();
	const { selectedAccount } = useCENNZWallet();
	const [CENNZBalance] = useCENNZBalances(stakingAsset);

	const deposit = stakeAction === "addStake" || stakeAction === "newStake";
	const withdraw = stakeAction === "cancelWithdrawal";
	const unstake = stakeAction === "unstake";
	const display = deposit || withdraw || unstake;

	// TODO: fetch staked balance
	const stakedBalance = useMemo(
		() => new Balance(10000 * 10000, stakingAsset),
		[stakingAsset]
	);

	// TODO: fetch unbonded balance
	const unbondedBalance = useMemo(
		() => new Balance(100 * 10000, stakingAsset),
		[stakingAsset]
	);

	const onStakeMaxRequest = useMemo(() => {
		if (deposit) return () => stakeAmountInput.setValue(CENNZBalance.toInput());
		if (unstake)
			return () => stakeAmountInput.setValue(stakedBalance.toInput());
		if (withdraw)
			return () => stakeAmountInput.setValue(unbondedBalance.toInput());
	}, [
		deposit,
		unstake,
		withdraw,
		stakeAmountInput,
		CENNZBalance,
		stakedBalance,
		unbondedBalance,
	]);

	const { inputRef: stakeAmountInputRef } = useBalanceValidation(
		Balance.fromInput(stakeAmountInput.value, stakingAsset),
		CENNZBalance
	);

	return (
		<div {...props} css={styles.root}>
			{display && (
				<div>
					<label htmlFor="stakeAmountInput">amount</label>
					<TokenInput
						onMaxValueRequest={onStakeMaxRequest}
						selectedTokenId={stakingAsset.assetId}
						onTokenChange={() => {}}
						value={stakeAmountInput.value}
						onValueChange={stakeAmountInput.onValueChange}
						tokens={[stakingAsset]}
						id="stakeAmountInput"
						ref={stakeAmountInputRef}
						min={stakedBalance ? 1 : 10000}
						required
						scale={4}
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
								<div>
									The minimum staked amount of {stakingAsset.symbol} is{" "}
									<strong>10000</strong>
								</div>
							}
							arrow
							placement="right"
						>
							<HelpOutlineIcon fontSize={"0.5em" as any} />
						</Tooltip>
					</TokenInput>
					{!!CENNZBalance && deposit && (
						<div css={styles.CENNZBalance}>
							Balance: <span>{CENNZBalance?.toBalance() ?? "0.0000"}</span>
						</div>
					)}
					{stakedBalance && unstake && (
						<div css={styles.CENNZBalance}>
							UNStakeable: <span>{stakedBalance?.toBalance() ?? "0.0000"}</span>
						</div>
					)}
					{unbondedBalance && withdraw && (
						<div css={styles.CENNZBalance}>
							Withdrawable:{" "}
							<span>{unbondedBalance?.toBalance() ?? "0.0000"}</span>
						</div>
					)}
					{!CENNZBalance && !stakedBalance && !!selectedAccount && (
						<div css={styles.CENNZBalance}>
							Balance: <LinearProgress css={[styles.formInfoProgress]} />
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default StakeAmountInput;

const styles = {
	root: ({ palette }: Theme) => css`
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

	CENNZBalance: ({ palette }: Theme) => css`
		margin-top: 0.25em;
		font-weight: 500;
		color: ${palette.grey["700"]};
		font-size: 14px;
		display: flex;
		align-items: center;

		span {
			font-family: "Roboto Mono", monospace;
			font-weight: bold;
			margin-left: 0.25em;
			letter-spacing: -0.025em;
		}
	`,

	formInfoProgress: css`
		display: inline-block;
		width: 25px;
		border-radius: 10px;
		opacity: 0.5;
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

		strong {
			font-family: "Roboto Mono", monospace;
		}
	`,
};
