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

const ExpiryCell: VFC<{ expiryRaw: number; expiryString: string }> = ({
	expiryRaw,
	expiryString,
}) => {
	const [expiry, setExpiry] = useState<string>("");
	const [seconds, setSeconds] = useState<number>(0);

	useEffect(() => {
		if (expiryRaw * 1000 > Date.now() + 600000) return setExpiry(expiryString);

		const intervalId = setInterval(() => {
			setSeconds((seconds) => seconds + 1);
			setExpiry(getMinutesAndSeconds(expiryRaw - seconds));
		}, 1000);

		return () => clearInterval(intervalId);
	}, [expiryString, expiryRaw, seconds, setExpiry]);

	return (
		<TableCell css={[styles.column, styles.number]}>
			{expiry && expiry}
			{!expiry && <LinearProgress css={[styles.expiryProgress]} />}
		</TableCell>
	);
};

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
						<TableCell css={styles.column}>Value</TableCell>
						<TableCell css={styles.column}>Expiry</TableCell>
						<TableCell css={styles.column}>Action</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{!someUnclaimed && (
						<TableRow css={[styles.row, styles.rowEmpty]}>
							<TableCell colSpan={4}>
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
									{/* Value */}
									<TableCell css={[styles.column, styles.number]}>
										{unclaimed.transferAmount.toInput()}{" "}
										{unclaimed.transferAsset.symbol}
									</TableCell>
									{/* Expiry */}
									<ExpiryCell
										expiryRaw={unclaimed.expiryRaw}
										expiryString={unclaimed.expiry}
									/>
									{/* Action */}
									<TableCell css={styles.column}>
										<button
											onClick={() => processHistoricalRequest(unclaimed)}
											type="button"
										>
											claim
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
