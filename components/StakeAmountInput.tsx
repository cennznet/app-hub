import { useMemo, VFC } from "react";
import { css } from "@emotion/react";
import TokenInput from "@/components/shared/TokenInput";
import { useStake } from "@/providers/StakeProvider";
import { useBalanceValidation, useCENNZBalances, useTokenInput } from "@/hooks";
import { Balance } from "@/utils";
import { CENNZAsset } from "@/types";
import { LinearProgress, Theme } from "@mui/material";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";

const StakeAmountInput: VFC = () => {
	const { stakeAsset } = useStake();
	const [stakeSelect, stakeInput] = useTokenInput(stakeAsset.assetId);
	const { selectedAccount } = useCENNZWallet();
	const [CENNZBalance] = useCENNZBalances(stakeAsset as CENNZAsset);

	// TODO: fetch staked balance
	const stakedBalance = 10000;

	const onStakeMaxRequest = useMemo(
		() => () => stakeInput.setValue(CENNZBalance.toInput()),
		[CENNZBalance, stakeInput]
	);

	const { inputRef: stakeInputRef } = useBalanceValidation(
		Balance.fromInput(stakeInput.value, stakeAsset),
		CENNZBalance
	);

	return (
		<div css={styles.root}>
			<label htmlFor="stakeInput">Staking Asset</label>
			<TokenInput
				onMaxValueRequest={onStakeMaxRequest}
				selectedTokenId={stakeAsset.assetId}
				onTokenChange={stakeSelect.onTokenChange}
				value={stakeInput.value}
				onValueChange={stakeInput.onValueChange}
				tokens={[stakeAsset]}
				id="stakeInput"
				ref={stakeInputRef}
				padFractionalZeros={false}
				min={stakedBalance ? 0.0001 : 10000}
				required
				scale={4}
			/>
			{CENNZBalance !== null && (
				<div css={styles.CENNZBalance}>
					Balance: <span>{CENNZBalance?.toBalance() ?? "0.0000"}</span>
				</div>
			)}
			{CENNZBalance === null && !!selectedAccount && (
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
};
