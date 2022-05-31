import { FC, ReactNode } from "react";
import { IntrinsicElements } from "@/libs/types";
import { css } from "@emotion/react";
import { useSwap } from "@providers/SwapProvider";
import { Theme, CircularProgress } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { Balance, selectMap } from "@utils";
import { StandardButton, Link, ProgressOverlay } from "@components";
import { useBeforeUnload } from "@hooks";

interface SwapProgressProps {}

const SwapProgress: FC<IntrinsicElements["div"] & SwapProgressProps> = () => {
	const { txStatus, setTxIdle } = useSwap();
	const { txHashLink, ...txProps } = txStatus?.props ?? {};
	const dismissible =
		txStatus?.status === "Success" || txStatus?.status === "Failure";

	useBeforeUnload(txStatus);

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

export default SwapProgress;

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
	txHash: string;
	exchangeValue: Balance;
	receiveValue: Balance;
}

const TxSuccess: FC<IntrinsicElements["div"] & TxSuccessProps> = ({
	exchangeValue,
	receiveValue,
}) => {
	return (
		<div>
			<CheckCircleOutlinedIcon css={styles.statusSuccess} />
			<h1>Transaction Completed</h1>
			<p>
				You successfully swapped{" "}
				<em>
					<span>{exchangeValue.toBalance()}</span>{" "}
					<span>{exchangeValue.getSymbol()}</span>
				</em>{" "}
				for{" "}
				<em>
					<span>{receiveValue.toBalance()}</span>{" "}
					<span>{receiveValue.getSymbol()}</span>
				</em>
				.
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
