import { FC, ReactNode } from "react";
import { IntrinsicElements } from "@/libs/types";
import { css } from "@emotion/react";
import { usePool } from "@/libs/providers/PoolProvider";
import { Theme, CircularProgress } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { StandardButton, Link, ProgressOverlay } from "@/libs/components";
import { Balance, selectMap } from "@/libs/utils";
import { useBeforeUnload } from "@/libs/hooks";

interface PoolProgressProps {}

const PoolProgress: FC<IntrinsicElements["div"] & PoolProgressProps> = () => {
	const { txStatus, setTxIdle } = usePool();
	const { txHashLink, ...txProps } = txStatus?.props ?? {};
	const dismissible =
		txStatus?.status === "Success" || txStatus?.status === "Failure";

	useBeforeUnload(txStatus);

	return (
		<ProgressOverlay
			onRequestClose={setTxIdle}
			show={!!txStatus}
			dismissible={
				txStatus?.status === "Success" || txStatus?.status === "Failure"
			}
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
				<Link href={txHashLink} css={styles.button}>
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

export default PoolProgress;

interface TxPendingProps {}

const TxPending: FC<IntrinsicElements["div"] & TxPendingProps> = (props) => {
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
	tradeValue: Balance;
	coreValue: Balance;
}

const TxSuccess: FC<IntrinsicElements["div"] & TxSuccessProps> = ({
	tradeValue,
	coreValue,
}) => {
	const { poolAction } = usePool();

	return (
		<div>
			<CheckCircleOutlinedIcon css={styles.statusSuccess} />
			<h1>Transaction Completed</h1>
			<p>
				You successfully {poolAction === "Remove" ? "withdrew" : "added"}{" "}
				<em>
					<span>{tradeValue.toBalance()}</span>{" "}
					<span>{tradeValue.getSymbol()}</span>
				</em>{" "}
				and{" "}
				<em>
					<span>{coreValue.toBalance()}</span>{" "}
					<span>{coreValue.getSymbol()}</span>
				</em>{" "}
				{poolAction === "Remove" ? "from" : "to"} the Liquidity Pool.
			</p>
		</div>
	);
};

interface TxFailureProps {
	errorCode?: string;
}

const TxFailure: FC<IntrinsicElements["div"] & TxFailureProps> = ({
	errorCode,
	...props
}) => {
	return (
		<div {...props}>
			<ErrorOutlineOutlinedIcon css={styles.statusFailure} />
			<h1>Transaction Failed</h1>
			<p>
				An error occurred while processing your transaction. It might have gone
				through, check your balances before you try again.
			</p>
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

	button: css`
		margin-top: 1em;
	`,

	dismissButton: css`
		margin-top: 0.5em;
	`,

	errorCode: css`
		margin-top: 0.5em;
	`,
};
