import { useLayoutEffect, useState, VFC } from "react";
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
import { WithdrawClaim } from "@/types";
import { getMinutesAndSeconds } from "@/utils";

const _renderExpiry = (expiryRaw, expiryString) => {
	const [expiry, setExpiry] = useState<string>("");
	const [seconds, setSeconds] = useState<number>(0);

	useLayoutEffect(() => {
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

const BridgeUnclaimedWithdrawals: VFC<{
	unclaimedWithdrawals: WithdrawClaim[];
}> = ({ unclaimedWithdrawals }) => {
	const processHistoricalRequest = useHistoricalWithdrawRequest();

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
					{unclaimedWithdrawals.map((unclaimed) => (
						<TableRow key={unclaimed.eventProofId}>
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
							{_renderExpiry(unclaimed.expiryRaw, unclaimed.expiry)}
							{/* Action */}
							<TableCell css={styles.column}>
								{unclaimed.expiry !== "Expired" && (
									<button
										css={styles.claimButton}
										onClick={() => processHistoricalRequest(unclaimed)}
										type="button"
									>
										claim
									</button>
								)}
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

	expiryProgress: css`
		margin: 0 auto;
		width: 25px;
		border-radius: 10px;
		opacity: 0.5;
		transition: opacity 0.2s;
	`,

	claimButton: ({ palette, transitions }: Theme) => css`
		border-radius: 4px;
		height: 1.7em;
		width: 4em;

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
	`,
};
