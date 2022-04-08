import { ReactNode, useMemo, VFC } from "react";
import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { CircularProgress, Theme } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import StandardButton from "@/components/shared/StandardButton";
import { Balance, selectMap } from "@/utils";
import Link from "@/components/Link";
import ProgressOverlay from "@/components/shared/ProgressOverlay";
import { useStake } from "@/providers/StakeProvider";

interface StakeProgressProps {}

const StakeProgress: VFC<IntrinsicElements["div"] & StakeProgressProps> = ({
	...props
}) => {
	const { txStatus, setTxIdle } = useStake();
	const { txHashLink, ...txProps } = txStatus?.props ?? {};
	const dismissible =
		txStatus?.status === "Success" || txStatus?.status === "Failure";

	return (
		<ProgressOverlay
			onRequestClose={setTxIdle}
			show={!!txStatus}
			dismissible={dismissible}
		>
			{selectMap<typeof txStatus["status"], ReactNode>(
				txStatus?.status,
				{
					Pending: <TxPending {...txProps} />,
					Success: <TxSuccess {...txProps} />,
					Failure: <TxFailure {...txProps} />,
				},
				null
			)}

			{!!txHashLink && (
				<Link href={txHashLink} css={styles.viewButton}>
					<StandardButton>View Transaction</StandardButton>
				</Link>
			)}

			{dismissible && (
				<StandardButton
					variant="secondary"
					css={styles.dismissButton}
					onClick={setTxIdle}
				>
					Dismiss
				</StandardButton>
			)}
		</ProgressOverlay>
	);
};

export default StakeProgress;

interface TxPendingProps {}

const TxPending: VFC<IntrinsicElements["div"] & TxPendingProps> = (props) => {
	return (
		<div {...props}>
			<CircularProgress size="3em" />
			<h1>Transaction In Progress</h1>
			<p>
				Please sign the transaction when prompted and wait until it&apos;s
				completed
			</p>
		</div>
	);
};

interface TxSuccessProps {
	txHash: string;
	stakeValue: Balance;
}

const TxSuccess: VFC<IntrinsicElements["div"] & TxSuccessProps> = ({
	stakeValue,
	...props
}) => {
	const { stakeAction, stakingAsset, unbondedBalance } = useStake();
	const message = useMemo(() => {
		switch (stakeAction) {
			default:
				return "made a transaction";
			case "addStake":
				return "added";
			case "newStake":
				return "staked";
			case "chill":
				return "set staking to stop after this era";
			case "changeNominations":
				return "changed your nominated validators";
			case "cancelWithdrawal":
				return "cancelled your withdrawal";
			case "changeController":
				return "changed the controller account for your stash";
			case "changeRewardDestination":
				return "changed the reward destination for your stash";
			case "unstake":
				return "UNStaked";
			case "withdraw":
				return "set a withdraw of";
		}
	}, [stakeAction]);

	const displayAmount =
		stakeAction === "addStake" ||
		stakeAction === "newStake" ||
		stakeAction === "unstake";

	return (
		<div>
			<CheckCircleOutlinedIcon css={styles.statusSuccess} />
			<h1>Transaction Completed</h1>
			<p>
				You successfully {message}
				{displayAmount ? (
					<>
						{" "}
						<em>
							<span>{stakeValue.toBalance()}</span>{" "}
							<span>{stakeValue.getSymbol()}</span>
						</em>
						.
					</>
				) : (
					"."
				)}
				{stakeAction === "withdraw" && (
					<>
						{" "}
						<em>
							<span>{unbondedBalance.toBalance()}</span>{" "}
							<span>{stakingAsset.symbol}</span>
						</em>
						.
					</>
				)}
			</p>
		</div>
	);
};

interface TxFailureProps {
	errorCode?: string;
}

const TxFailure: VFC<IntrinsicElements["div"] & TxFailureProps> = ({
	errorCode,
	...props
}) => {
	return (
		<div {...props}>
			<ErrorOutlineOutlinedIcon css={styles.statusFailure} />
			<h1>Transaction Failed</h1>
			<p>An error occurred while processing your transaction.</p>
			{!!errorCode && (
				<div css={styles.errorCode}>
					<pre>
						<small>#{errorCode}</small>
					</pre>
				</div>
			)}
		</div>
	);
};

const styles = {
	statusSuccess: ({ palette }: Theme) => css`
		width: 4em;
		height: 4em;
		font-size: 14px;
		color: ${palette.success.main};
	`,

	statusFailure: ({ palette }: Theme) => css`
		width: 4em;
		height: 4em;
		font-size: 14px;
		color: ${palette.warning.main};
	`,

	viewButton: css`
		margin-top: 1em;
	`,

	dismissButton: css`
		margin-top: 0.5em;
	`,

	errorCode: css`
		margin-top: 0.5em;
	`,
};
