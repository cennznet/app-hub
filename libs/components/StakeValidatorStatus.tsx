import { VFC } from "react";
import { css } from "@emotion/react";
import { NominatedBy } from "@/libs/types";
import { Theme, Tooltip } from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";

interface StakeValidatorStatusProps {
	nominators: NominatedBy[];
	isElected: boolean;
	onlineCount?: number;
	hasMessage?: boolean;
}

const StakeValidatorStatus: VFC<StakeValidatorStatusProps> = ({
	nominators,
	isElected,
	onlineCount,
	hasMessage,
}) => {
	return (
		<div css={styles.root}>
			{isElected ? (
				<Tooltip css={styles.tooltip} title="Elected" placement="left" arrow>
					<CheckCircleOutlinedIcon css={styles.elected(isElected)} />
				</Tooltip>
			) : (
				<Tooltip css={styles.tooltip} title="Candidate" placement="left" arrow>
					<PendingOutlinedIcon css={styles.elected(isElected)} />
				</Tooltip>
			)}
			{(onlineCount || hasMessage) && (
				<Tooltip
					css={styles.tooltip}
					title={`Validator is online and has authored ${
						onlineCount ?? 0
					} of the last 120 blocks`}
					placement="left"
					arrow
				>
					<NumbersRoundedIcon css={styles.onlineCount} />
				</Tooltip>
			)}
			{nominators.length > 200 && (
				<Tooltip
					css={styles.tooltip}
					title={`Validator is oversubscribed with ${nominators.length} nominators`}
					placement="left"
					arrow
				>
					<ScaleRoundedIcon css={styles.overSubscribed} />
				</Tooltip>
			)}
		</div>
	);
};

export default StakeValidatorStatus;

const styles = {
	root: css`
		display: inline-flex;
		justify-content: space-between;
		margin-top: 0.2em;
	`,

	tooltip: css`
		cursor: help;
	`,

	elected:
		(isElected: boolean) =>
		({ palette }: Theme) =>
			css`
				color: ${isElected ? palette.success.main : "#2DC8CB"};
			`,

	onlineCount: ({ palette }: Theme) => css`
		color: ${palette.primary.main};
	`,

	overSubscribed: ({ palette }: Theme) =>
		css`
			color: ${palette.error.main};
		`,
};
