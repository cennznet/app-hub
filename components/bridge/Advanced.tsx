import { VFC } from "react";
import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import {
	Theme,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	TextField,
	Tooltip,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface BridgeAdvancedProps {
	historicalEventProofId: number;
	setHistoricalEventProofId: Function;
}

const BridgeAdvanced: VFC<IntrinsicElements["div"] & BridgeAdvancedProps> = (
	props
) => {
	return (
		<div {...props} css={styles.root}>
			<Accordion css={[styles.formSettings]}>
				<AccordionSummary
					css={styles.formSettingsSummary}
					expandIcon={<ExpandMore />}
				>
					Advanced
				</AccordionSummary>
				<AccordionDetails>
					<div css={styles.formField}>
						<label htmlFor="historicalEventProofId">
							Historical Event Proof Id
						</label>
						<TextField
							css={styles.input}
							value={props.historicalEventProofId}
							onChange={(event) =>
								props.setHistoricalEventProofId(event.target.value)
							}
							required
							type="number"
							InputProps={{
								endAdornment: <EventProofToolTip />,
							}}
						/>
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

const EventProofToolTip: VFC<IntrinsicElements["div"]> = () => (
	<div style={{ cursor: "pointer" }}>
		<Tooltip
			disableFocusListener
			PopperProps={
				{
					sx: styles.toolTip,
				} as any
			}
			title={
				<div>
					If a previous withdraw has failed you can enter the event proof id
					here to claim it. Make sure to select the right token and amount!
				</div>
			}
			arrow
			placement="right"
		>
			<HelpOutlineIcon fontSize={"0.5em" as any} />
		</Tooltip>
	</div>
);

export default BridgeAdvanced;

const styles = {
	root: css`
		margin-top: 1em;
		width: 90%;
	`,

	formSettings: css`
		box-shadow: none;

		&:before {
			display: none;
		}
	`,

	formField: css`
		margin-top: 1em;
		margin-bottom: 1em;

		label {
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
		}
	`,

	formSettingsSummary: ({ palette }: Theme) => css`
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

	input: css`
		width: 200px;
	`,

	toolTip: css`
		max-width: 200px;
	`,
};
