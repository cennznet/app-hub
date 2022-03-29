import { Dispatch, SetStateAction, useEffect, VFC } from "react";
import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	TextField,
	Theme,
	Tooltip,
	InputAdornment,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useBridge } from "@/providers/BridgeProvider";
import { useBlockHashValidation } from "@/hooks";

interface HistoricalWithdrawalProps {
	expanded: boolean;
	setExpanded: Dispatch<SetStateAction<boolean>>;
}

const HistoricalWithdrawal: VFC<
	IntrinsicElements["div"] & HistoricalWithdrawalProps
> = ({ expanded, setExpanded, ...props }) => {
	const {
		historicalBlockHash,
		setHistoricalBlockHash,
		historicalEventProofId,
		setHistoricalEventProofId,
	} = useBridge();
	const { inputRef: blockHashRef } = useBlockHashValidation(
		historicalBlockHash,
		expanded
	);

	useEffect(() => {
		if (expanded) return;

		setHistoricalBlockHash(null);
		setHistoricalEventProofId(null);
	}, [expanded, setHistoricalBlockHash, setHistoricalEventProofId]);

	return (
		<div {...props} css={styles.root}>
			<Accordion
				css={[styles.formSettings]}
				expanded={expanded}
				onChange={() => setExpanded(!expanded)}
			>
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
							type="number"
							css={styles.proofId}
							required={expanded}
							value={historicalEventProofId ?? ""}
							onChange={(event) =>
								setHistoricalEventProofId(Number(event.target.value))
							}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<EventProofToolTip field="id" />
									</InputAdornment>
								),
								inputProps: { min: 1 },
							}}
						/>
						<label htmlFor="historicalBlockHash">Block Hash</label>
						<TextField
							type="text"
							css={styles.blockHash}
							required={expanded}
							inputRef={blockHashRef}
							value={historicalBlockHash ?? ""}
							onChange={(event) => setHistoricalBlockHash(event.target.value)}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<EventProofToolTip field="hash" />
									</InputAdornment>
								),
							}}
							multiline
							fullWidth
						/>
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

interface EventProofToolTipProps {
	field: string;
}

const EventProofToolTip: VFC<
	IntrinsicElements["div"] & EventProofToolTipProps
> = (props) => (
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
					{props.field === "id" && (
						<>
							If a previous withdraw has failed you can enter the event proof id
							here to claim it. Make sure to select the right token and amount!
						</>
					)}
					{props.field === "hash" && (
						<>The CENNZnet block hash at the time of the withdrawal event.</>
					)}
					{props.field === "invalidHash" && <>Invalid block hash!</>}
				</div>
			}
			arrow
			placement="right"
		>
			<HelpOutlineIcon fontSize={"0.5em" as any} />
		</Tooltip>
	</div>
);

export default HistoricalWithdrawal;

const styles = {
	root: css`
		margin-top: 1em;
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

	proofId: css`
		width: 200px;
		margin-bottom: 1em;
	`,

	blockHash: css`
		//width: 470px;
	`,

	toolTip: css`
		max-width: 200px;
	`,
};
