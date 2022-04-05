import { ReactNode, VFC } from "react";
import { IntrinsicElements, RelayerConfirmingStatus } from "@/types";
import { css } from "@emotion/react";
import { useBridge } from "@/providers/BridgeProvider";
import { Theme, CircularProgress } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import StandardButton from "@/components/shared/StandardButton";
import ProgressOverlay from "@/components/shared/ProgressOverlay";
import Link from "@/components/Link";
import { Balance, selectMap } from "@/utils";

interface BridgeProgressProps {}

const BridgeProgress: VFC<IntrinsicElements["div"] & BridgeProgressProps> = (
	props
) => {
	const { txStatus, setTxIdle } = useBridge();
	const { txHashLink, ...txProps } = txStatus?.props ?? {};

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
		</ProgressOverlay>
	);
};

export default BridgeProgress;

interface TxPendingProps {
	relayerStatus: RelayerConfirmingStatus;
}

const TxPending: VFC<IntrinsicElements["div"] & TxPendingProps> = ({
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

interface TxSuccessProps {
	transferValue: Balance;
}

const TxSuccess: VFC<IntrinsicElements["div"] & TxSuccessProps> = ({
	transferValue,
	...props
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
			<p>
				An error occurred while processing your transaction. It might have gone
				through, check your balances before trying again.
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

	errorCode: css`
		margin-top: 0.5em;
	`,
};
