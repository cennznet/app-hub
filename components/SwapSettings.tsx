import { VFC } from "react";
import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import {
	Theme,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	TextField,
	InputAdornment,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { useSwap } from "@/providers/SwapProvider";

interface SwapSettingsProps {}

const SwapSettings: VFC<IntrinsicElements["div"] & SwapSettingsProps> = ({
	...props
}) => {
	const { slippage, setSlippage } = useSwap();

	return (
		<div {...props} css={styles.root}>
			<Accordion css={[styles.formSettings]}>
				<AccordionSummary
					css={styles.formSettingsSummary}
					expandIcon={<ExpandLess />}
				>
					Settings
				</AccordionSummary>
				<AccordionDetails>
					<div css={styles.formField}>
						<label htmlFor="slippageInput">Slippage</label>
						<TextField
							css={styles.slippageInput}
							value={slippage}
							onChange={(event) => setSlippage(event.target.value)}
							required
							type="number"
							inputProps={{
								min: 0,
								max: 100,
							}}
							InputProps={{
								endAdornment: <InputAdornment position="end">%</InputAdornment>,
							}}
						/>
					</div>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

export default SwapSettings;

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
			font-size: 0.875em;
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

		.MuiAccordionSummary-expandIconWrapper.Mui-expanded {
			color: ${palette.primary.main};
		}
	`,

	slippageInput: css`
		width: 200px;
	`,
};
