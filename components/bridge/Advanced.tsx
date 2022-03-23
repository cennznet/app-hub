import { useEffect, useState, VFC } from "react";
import { IntrinsicElements, WithdrawClaim } from "@/types";
import { css } from "@emotion/react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Divider,
	Theme,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface BridgeAdvancedProps {
	historicalEventProofId: number;
	setHistoricalEventProofId: Function;
	blockHash: string;
	setBlockHash: Function;
}

const testArr: WithdrawClaim[] = [
	{ token: "DAI", amount: 300, eventProofId: 1, blockHash: "test-block-hash" },
	{ token: "ETH", amount: 0.5, eventProofId: 1, blockHash: "test-block-hash" },
];

const BridgeAdvanced: VFC<IntrinsicElements["div"] & BridgeAdvancedProps> = (
	props
) => {
	// const { selectedAccount } = useCENNZWallet();
	const [unclaimedWithdrawals, setUnclaimedWithdrawals] =
		useState<WithdrawClaim[]>(testArr);

	// useEffect(() => {
	// 	if (!selectedAccount) return;
	//
	// 	(async () =>
	// 		setUnclaimedWithdrawals(
	// 			await fetchUnclaimedWithdrawals(selectedAccount.address)
	// 		))();
	// }, [selectedAccount, setUnclaimedWithdrawals]);

	const submitHistoricalClaim = async (unclaimed: WithdrawClaim) => {
		console.log("unclaimed.token", unclaimed.token);
		console.log("unclaimed.amount", unclaimed.amount);
		console.log("unclaimed.eventProofId", unclaimed.eventProofId);
		console.log("unclaimed.blockHash", unclaimed.blockHash);
	};

	return (
		<div {...props} css={styles.root}>
			<Accordion css={[styles.accordion]}>
				<AccordionSummary
					css={styles.accordionSummary}
					expandIcon={<ExpandMore />}
				>
					Advanced
				</AccordionSummary>
				<AccordionDetails>
					<div css={styles.unclaimedWithdrawals}>
						<p>UNclaimed Withdrawals:</p>
						{unclaimedWithdrawals?.map((unclaimed, i) => (
							<div key={i}>
								<div css={styles.unclaimed}>
									<p>
										UNclaimed: {unclaimed.amount} {unclaimed.token}
									</p>
									<button
										css={styles.claimButton}
										onClick={() => submitHistoricalClaim(unclaimed)}
									>
										claim
									</button>
								</div>

								<Divider css={styles.unclaimedDivider} />
							</div>
						))}
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default BridgeAdvanced;

const styles = {
	root: css`
		margin-top: 1em;
		width: 90%;
	`,

	accordion: css`
		box-shadow: none;

		&:before {
			display: none;
		}
	`,

	accordionSummary: ({ palette }: Theme) => css`
		text-transform: uppercase;
		font-weight: bold;
		padding: 0;
		justify-content: flex-start;

		.MuiAccordionSummary-content {
			flex-grow: 0;
			margin: 0 !important;
		}

		.MuiAccordionSummary-content.Mui-expanded,
		.MuiAccordionSummary-expandIconWrapper.Mui-expanded {
			color: ${palette.primary.main};
		}
	`,

	unclaimedWithdrawals: css`
		margin-top: 1em;
		margin-bottom: 1em;
		display: block;

		p {
			font-weight: bold;
			font-size: 14px;
			display: block;
		}
	`,

	unclaimed: css`
		margin-bottom: 0.5em;
		display: flex;
		justify-content: space-between;
		align-items: center;

		p {
			font-family: "Roboto Mono", monospace;
			margin-bottom: 1em;
		}
	`,

	claimButton: ({ palette, transitions }: Theme) => css`
		display: inline-block;
		border-radius: 4px;
		height: 2em;
		width: 5em;
		//align-self: center;

		background-color: white;
		font-weight: bold;
		cursor: pointer;
		transition: background-color ${transitions.duration.short}ms,
			color ${transitions.duration.short}ms;

		font-size: 14px;
		text-transform: uppercase;
		border: 1px solid ${palette.primary.main};
		color: ${palette.primary.main};

		&:hover {
			background-color: ${palette.primary.main};
			color: white;
		}
	`,

	unclaimedDivider: css`
		margin-bottom: 1em;
	`,
};
