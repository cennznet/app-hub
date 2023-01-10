import { useMemo, VFC } from "react";
import { css } from "@emotion/react";
import TokenInput from "@/libs/components/shared/TokenInput";
import { useStake } from "@/libs/providers/StakeProvider";
import {
	useBalanceValidation,
	useCENNZBalances,
	useTokenInput,
} from "@/libs/hooks";
import { Balance } from "@/libs/utils";
import { IntrinsicElements } from "@/libs/types";
import { LinearProgress, Theme, Tooltip } from "@mui/material";
import { useCENNZWallet } from "@/libs/providers/CENNZWalletProvider";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface StakeAmountInputProps {}

const StakeAmountInput: VFC<
	IntrinsicElements["div"] & StakeAmountInputProps
> = (props) => {
	const { stakingAsset, stakeAction } = useStake();
	const [stakeSelect, stakeInput] = useTokenInput(stakingAsset?.assetId);
	const { selectedAccount } = useCENNZWallet();
	const [CENNZBalance] = useCENNZBalances([stakingAsset]);

	// TODO: fetch staked balance
	const stakedBalance = useMemo(
		() => new Balance(10000 * 10000, stakingAsset),
		[stakingAsset]
	);

	const onStakeMaxRequest = useMemo(() => {
		if (stakeAction === "stake")
			return () => stakeInput.setValue(CENNZBalance.toInput());
		if (stakeAction === "unstake")
			return () => stakeInput.setValue(stakedBalance.toInput());
	}, [stakeAction, stakeInput, CENNZBalance, stakedBalance]);

	const { inputRef: stakeInputRef } = useBalanceValidation(
		Balance.fromInput(stakeInput.value, stakingAsset),
		CENNZBalance
	);

	return (
		<div {...props} css={styles.root}>
			<label htmlFor="stakeInput">stake amount</label>
			<TokenInput
				onMaxValueRequest={onStakeMaxRequest}
				selectedTokenId={stakingAsset?.assetId}
				onTokenChange={stakeSelect.onTokenChange}
				value={stakeInput.value}
				onValueChange={stakeInput.onValueChange}
				tokens={[stakingAsset]}
				id="stakeInput"
				ref={stakeInputRef}
				min={stakedBalance ? 0.0001 : 10000}
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
							The minimum staked amount of {stakingAsset?.symbol} is{" "}
							<strong>10000</strong>
						</div>
					}
					arrow
					placement="right"
				>
					<HelpOutlineIcon fontSize={"0.5em" as any} />
				</Tooltip>
			</TokenInput>
			{!!CENNZBalance && stakeAction === "stake" && (
				<div css={styles.CENNZBalance}>
					Balance: <span>{CENNZBalance?.toBalance() ?? "0.0000"}</span>
				</div>
			)}
			{stakedBalance && stakeAction === "unstake" && (
				<div css={styles.CENNZBalance}>
					UNStakeable: <span>{stakedBalance?.toBalance() ?? "0.0000"}</span>
				</div>
			)}
			{!CENNZBalance && !stakedBalance && !!selectedAccount && (
				<div css={styles.CENNZBalance}>
					Balance: <LinearProgress css={[styles.formInfoProgress]} />
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
