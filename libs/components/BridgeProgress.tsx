import { ReactNode, FC, memo } from "react";
import { IntrinsicElements, RelayerConfirmingStatus } from "@/libs/types";
import { css } from "@emotion/react";
import { useBridge } from "@providers/BridgeProvider";
import { Theme, CircularProgress } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { StandardButton, ProgressOverlay, Link } from "@components";
import { Balance, selectMap } from "@utils";
import { useBeforeUnload } from "@/libs/hooks";

interface BridgeProgressProps {}

const BridgeProgress: FC<
	IntrinsicElements["div"] & BridgeProgressProps
> = () => {
	const { txStatus, setTxIdle } = useBridge();
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

export default BridgeProgress;

interface TxPendingProps {
	relayerStatus: RelayerConfirmingStatus;
}

const TxPendingImpl: FC<IntrinsicElements["div"] & TxPendingProps> = ({
	relayerStatus,
	...props
}) => {
	return (
		<div {...props}>
			<CircularProgress size="3em" />
			<h1>
				{selectMap<RelayerConfirmingStatus, ReactNode>(
					relayerStatus,
					{
						EthereumConfirming: "Confirming on Ethereum",
						CennznetConfirming: (
							<>
								Confirming on CENNZ<span>net</span>
							</>
						),
					},
					"Transaction In Progress"
				)}
			</h1>
			<p>
				Please sign the transaction when prompted and wait until it&apos;s
				completed
			</p>
		</div>
	);
};

const TxPending = memo(TxPendingImpl);

interface TxSuccessProps {
	transferValue: Balance;
}

const TxSuccessImpl: FC<IntrinsicElements["div"] & TxSuccessProps> = ({
	transferValue,
}) => {
	const { bridgeAction } = useBridge();

	return (
		<div>
			<CheckCircleOutlinedIcon css={styles.statusSuccess} />
			<h1>Transaction Completed</h1>
			<p>
				You successfully{" "}
				{bridgeAction === "Withdraw" ? "withdrew" : "deposited"}{" "}
				<em>
					<span>{transferValue.toBalance()}</span>{" "}
					<span>{transferValue.getSymbol()}</span>
				</em>{" "}
				{bridgeAction === "Withdraw" ? "from" : "to"} CENNZnet.
			</p>
		</div>
	);
};

const TxSuccess = memo(TxSuccessImpl);

interface TxFailureProps {
	errorCode?: string;
}

const TxFailureImpl: FC<IntrinsicElements["div"] & TxFailureProps> = ({
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

const TxFailure = memo(TxFailureImpl);

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
