import { useEffect, useState, VFC } from "react";
import { css } from "@emotion/react";
import {
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
} from "@mui/material";
import { useHistoricalWithdrawRequest } from "@/hooks";
import { getMinutesAndSeconds } from "@/utils";
import { useBridge } from "@/providers/BridgeProvider";
import { WithdrawClaim } from "@/types";

const BridgeUnclaimedWithdrawals: VFC = () => {
	const { unclaimedWithdrawals } = useBridge();
	const processHistoricalRequest = useHistoricalWithdrawRequest();

	const someUnclaimed = unclaimedWithdrawals?.some(
		(unclaimed) => unclaimed.expiry !== "Expired"
	);

	return (
		<TableContainer css={styles.container}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell css={styles.column}>ID</TableCell>
						<TableCell css={styles.column}>Entry</TableCell>
						<TableCell css={styles.column}>Action</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{!someUnclaimed && (
						<TableRow css={[styles.row, styles.rowEmpty]}>
							<TableCell colSpan={3}>
								No unclaimed withdrawals &nbsp;&#127881;
							</TableCell>
						</TableRow>
					)}

					{someUnclaimed &&
						unclaimedWithdrawals
							?.filter((unclaimed) => unclaimed.expiry !== "Expired")
							?.map((unclaimed) => (
								<TableRow css={styles.row} key={unclaimed.eventProofId}>
									{/* ID */}
									<TableCell css={[styles.column, styles.number]}>
										{unclaimed.eventProofId}
									</TableCell>
									{/* Expiry */}
									<EntryCell withdrawClaim={unclaimed} />
									{/* Action */}
									<TableCell css={styles.column}>
										<button
											onClick={() => processHistoricalRequest(unclaimed)}
											type="button"
										>
											Claim
										</button>
									</TableCell>
								</TableRow>
							))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default BridgeUnclaimedWithdrawals;

const EntryCell: VFC<{ withdrawClaim: WithdrawClaim }> = ({
	withdrawClaim,
}) => {
	const [expiry, setExpiry] = useState<string>("");
	const [seconds, setSeconds] = useState<number>(0);
	const {
		expiryRaw,
		expiry: expiryString,
		transferAmount,
		transferAsset,
		beneficiary,
	} = withdrawClaim;

	useEffect(() => {
		if (expiryRaw * 1000 > Date.now() + 600000) return setExpiry(expiryString);

		const intervalId = setInterval(() => {
			setSeconds((seconds) => seconds + 1);
			setExpiry(getMinutesAndSeconds(expiryRaw - seconds));
		}, 1000);

		return () => clearInterval(intervalId);
	}, [expiryString, expiryRaw, seconds, setExpiry]);

	const truncatedAddress = `${beneficiary.slice(0, 5)}...${beneficiary.slice(
		-4
	)}`;

	return (
		<TableCell css={[styles.column, styles.columnMain]}>
			<div>
				<strong>Transfer:</strong>{" "}
				<em>
					<span>{transferAmount.toInput()}</span>{" "}
					<span>{transferAsset.symbol}</span>
				</em>
			</div>
			<div>
				<strong>Address:</strong> <em>{truncatedAddress}</em>
			</div>

			<div>
				<strong>Expiry:</strong>{" "}
				<>
					{!!expiry && expiry}
					{!expiry && <LinearProgress css={[styles.expiryProgress]} />}
				</>
			</div>
		</TableCell>
	);
};

const styles = {
	container: css`
		margin-top: 0.2em;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		overflow-y: auto;
		white-space: nowrap;
		max-height: 15em;
	`,

	column: css`
		text-align: center;
	`,

	columnMain: ({ palette }: Theme) => css`
		text-align: left;

		em {
			font-family: "Roboto Mono", monospace;
			display: inline;
			letter-spacing: -0.025em;
			font-style: normal;
		}
	`,

	number: css`
		font-family: "Roboto Mono", monospace;
	`,

	row: ({ palette, transitions }: Theme) => css`
		transition: background-color ${transitions.duration.shortest}ms;
		&:nth-of-type(even) {
			background-color: rgba(0, 0, 0, 0.03);
		}

		&:last-of-type {
			td {
				border-bottom: none;
			}
		}

		&:hover {
			background-color: ${palette.info.main};
		}

		button {
			border-radius: 4px;
			height: 1.7em;
			width: 4em;
			outline: none;

			background-color: white;
			font-weight: bold;
			cursor: pointer;
			transition: background-color ${transitions.duration.short}ms,
				color ${transitions.duration.short}ms;

			font-size: 13px;
			text-transform: uppercase;
			border: 1px solid ${palette.primary.main};
			color: ${palette.primary.main};

			&:hover {
				background-color: ${palette.primary.main};
				color: white;
			}
		}
	`,

	rowEmpty: css`
		td {
			text-align: center;
		}
	`,

	expiryProgress: css`
		margin: 0 auto;
		width: 25px;
		border-radius: 10px;
		opacity: 0.5;
		transition: opacity 0.2s;
	`,
};
