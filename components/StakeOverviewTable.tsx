import { useState, VFC } from "react";
import { css } from "@emotion/react";
import StakeNominate from "@/components/StakeNominate";
import StakeElected from "@/components/StakeElected";
import { Theme } from "@mui/material";
import { useStake } from "@/providers/StakeProvider";
import SwapHoriz from "@mui/icons-material/SwapHoriz";

const StakeOverviewTable: VFC = () => {
	const { tableView, setTableView } = useStake();

	const [alt, setAlt] = useState<boolean>(false);

	const onLabelClick = () => {
		setAlt((alt) => !alt);
		tableView === "elected"
			? setTableView("nominate")
			: setTableView("elected");
	};

	return (
		<div css={styles.root}>
			<div css={styles.labelContainer} onClick={onLabelClick}>
				<label htmlFor="table view">{tableView}</label>
				<div css={styles.iconContainer}>
					<SwapHoriz css={[styles.icon, alt && styles.iconSpin]} />
				</div>
			</div>
			{tableView === "elected" && <StakeElected />}
			{tableView === "nominate" && <StakeNominate />}
		</div>
	);
};

export default StakeOverviewTable;

const styles = {
	root: ({ palette }: Theme) => css`
		label {
			cursor: pointer;
			font-weight: bold;
			font-size: 14px;
			text-transform: uppercase;
			vertical-align: center;
			margin-bottom: 1em;
			display: block;
			color: ${palette.primary.main};
		}
	`,

	labelContainer: css`
		display: inline-flex;
		cursor: pointer;
	`,

	iconContainer: css`
		height: 1.6em;
		margin-top: -0.7em;
		margin-left: 0.2em;
	`,

	icon: ({ palette }: Theme) =>
		css`
			height: 1.6em;
			transition: color 0.2s, transform 0.2s ease-out;
			color: ${palette.primary.main};
		`,

	iconSpin: css`
		transform: rotateZ(180deg);
	`,
};
