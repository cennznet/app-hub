import { useEffect, useState, FC, memo } from "react";
import { IntrinsicElements } from "@/libs/types";
import { css } from "@emotion/react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	LinearProgress,
	Theme,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useBridge } from "@providers/BridgeProvider";
import { BridgeUnclaimedWithdrawals } from "@components";

interface BridgeAdvancedProps {}

const BridgeWithdrawAdvanced: FC<
	IntrinsicElements["div"] & BridgeAdvancedProps
> = ({ ...props }) => {
	const {
		advancedExpanded: expanded,
		setAdvancedExpanded: setExpanded,
		advancedMounted,
		unclaimedWithdrawals,
		updateUnclaimedWithdrawals,
	}: any = useBridge();
	const [firstRender, setFirstRender] = useState<boolean>(true);

	useEffect(() => {
		if (expanded || firstRender) void updateUnclaimedWithdrawals();
	}, [expanded, firstRender, updateUnclaimedWithdrawals]);

	useEffect(() => {
		if (!unclaimedWithdrawals || !firstRender) return;

		setExpanded(true);
		setFirstRender(false);
	}, [unclaimedWithdrawals, firstRender, setExpanded]);

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
					<label css={styles.claimLabel}>Unclaimed Withdrawals</label>
					{!advancedMounted && (
						<LinearProgress css={[styles.claimCheckProgress]} />
					)}
					{advancedMounted && <BridgeUnclaimedWithdrawals />}
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default memo(BridgeWithdrawAdvanced);

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
		margin-left: 0.5em;
		margin-bottom: 0.15em;
		width: 25px;
		border-radius: 10px;
		opacity: 0.5;
		transition: opacity 0.2s;
	`,

	claimLabel: css`
		font-weight: bold;
		margin-bottom: 0.5em;
		display: inline-block;
	`,
};
