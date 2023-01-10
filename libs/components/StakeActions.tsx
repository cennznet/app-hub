import { VFC } from "react";
import { css } from "@emotion/react";
import SelectInput from "@/libs/components/shared/SelectInput";
import { MenuItem, Theme } from "@mui/material";
import { useStake } from "@/libs/providers/StakeProvider";
import { STAKE_ACTIONS } from "@/libs/constants";

const StakeActions: VFC = () => {
	const {
		stakeAction,
		setStakeAction,
		stakingAsset,
		spendingAsset,
		stakeAmountInput,
		setStakeRewardDestination,
		setStakeControllerAccount,
		unbondedBalance,
	} = useStake();

	const onActionChange = (event) => {
		setStakeAction(event.target.value);
		stakeAmountInput.setValue("");
		setStakeRewardDestination("");
		setStakeControllerAccount("");
	};

	return (
		<div css={styles.root}>
			<div css={styles.selectInput}>
				<label htmlFor="stakeActionSelect">Action</label>
				<SelectInput
					id="stakeActionSelect"
					onChange={onActionChange}
					value={stakeAction}
					inputProps={{ sx: styles.selectItem as any }}
				>
					{Object.keys(STAKE_ACTIONS).map((stakeAction, index) => (
						<MenuItem key={index} value={stakeAction} css={styles.selectItem}>
							<span>{STAKE_ACTIONS[stakeAction]}</span>
						</MenuItem>
					))}
				</SelectInput>
			</div>
			<div css={styles.formCopy}>
				{stakeAction === "newStake" && (
					<span>
						Stake <strong>{stakingAsset.symbol}</strong> and nominate the best
						validators to earn <strong>{spendingAsset.symbol}</strong> rewards.
						<br />
						Select validators from the table on the overview panel.
					</span>
				)}
				{stakeAction === "addStake" && (
					<span>
						Add <strong>{stakingAsset.symbol}</strong> to your stake and
						increase <strong>{spendingAsset.symbol}</strong> rewards.
					</span>
				)}
				{stakeAction === "chill" && (
					<span>Stop staking funds after this era.</span>
				)}
				{stakeAction === "changeNominations" && (
					<span>
						Nominate different validators for this stash.
						<br />
						Select validators from the table on the overview panel.
					</span>
				)}
				{stakeAction === "cancelWithdrawal" && (
					<span>
						Cancel withdrawal of <strong>{stakingAsset.symbol}</strong>.
					</span>
				)}
				{stakeAction === "changeController" && (
					<span>Change the controller account for this stash.</span>
				)}
				{stakeAction === "changeRewardDestination" && (
					<span>Change the reward destination for this stash.</span>
				)}
				{stakeAction === "unstake" && (
					<span>
						UNStake <strong>{stakingAsset.symbol}</strong> with a time delay.
					</span>
				)}
				{stakeAction === "withdraw" && (
					<span>
						Withdraw{" "}
						<span css={styles.number}>{unbondedBalance.toBalance()}</span>{" "}
						UNStaked <strong>{stakingAsset.symbol}</strong>.
					</span>
				)}
			</div>
		</div>
	);
};

export default StakeActions;

const styles = {
	root: ({ palette }: Theme) => css`
		margin-bottom: 1.5em;

		label {
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	selectInput: css`
		margin-bottom: 1em;

		.MuiOutlinedInput-root {
			width: 100%;
		}
	`,

	selectItem: css`
		display: flex;
		align-items: center;
		padding-top: 0.75em;
		padding-bottom: 0.75em;

		> span {
			text-transform: uppercase;
			font-size: 14px;
			font-weight: bold;
			flex: 1;
		}
	`,

	formCopy: css`
		margin-bottom: 1.5em;
		font-size: 14px;
		span {
			line-height: 150%;
		}
	`,

	number: css`
		font-family: "Roboto Mono", monospace;
	`,
};
