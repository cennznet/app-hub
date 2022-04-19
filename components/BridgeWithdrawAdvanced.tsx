import { useEffect, VFC } from "react";
import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	LinearProgress,
	Theme,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useBridge } from "@/providers/BridgeProvider";
import { useUnclaimedWithdrawals } from "@/hooks";
import BridgeUnclaimedWithdrawals from "@/components/BridgeUnclaimedWithdrawals";

interface BridgeAdvancedProps {}

const BridgeWithdrawAdvanced: VFC<
	IntrinsicElements["div"] & BridgeAdvancedProps
> = ({ ...props }) => {
	const {
		advancedExpanded: expanded,
		setAdvancedExpanded: setExpanded,
		advancedMounted,
	}: any = useBridge();
	const [unclaimedWithdrawals, updateUnclaimedWithdrawals] =
		useUnclaimedWithdrawals();
	const someUnclaimed = unclaimedWithdrawals?.some(
		(unclaimed) => unclaimed.expiry !== "Expired"
	);

	useEffect(() => {
		if (expanded) void updateUnclaimedWithdrawals();
	}, [updateUnclaimedWithdrawals, expanded]);

	return (
		<div {...props} css={styles.root}>
			<Accordion
				css={[styles.accordion]}
				expanded={expanded}
				onChange={() => setExpanded(!expanded)}
			>
				<AccordionSummary
					css={styles.accordionSummary}
					expandIcon={<ExpandMore />}
				>
					Advanced
				</AccordionSummary>
				<AccordionDetails>
					<br />
					<label htmlFor="unclaimedWithdrawalsTable">
						{(!advancedMounted || someUnclaimed) && (
							<span>unclaimed withdrawals</span>
						)}
						{advancedMounted && !someUnclaimed && (
							<span>no unclaimed withdrawals &nbsp;&#127881;</span>
						)}
					</label>
					{!advancedMounted && (
						<LinearProgress css={[styles.claimCheckProgress]} />
					)}
					{advancedMounted && someUnclaimed && (
						<BridgeUnclaimedWithdrawals
							unclaimedWithdrawals={unclaimedWithdrawals}
						/>
					)}
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default BridgeWithdrawAdvanced;

const styles = {
	root: css`
		margin-top: 1em;

		label {
			text-transform: uppercase;
			font-size: 14px;
		}
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

	claimCheckProgress: css`
		display: inline-flex;
		margin-left: 1em;
		margin-bottom: 0.2em;
		width: 25px;
		border-radius: 10px;
		opacity: 0.5;
		transition: opacity 0.2s;
	`,
};
