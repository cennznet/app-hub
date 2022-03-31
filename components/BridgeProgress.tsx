import { VFC } from "react";
import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { useBridge } from "@/providers/BridgeProvider";
import { Theme, CircularProgress } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import StandardButton from "@/components/shared/StandardButton";

interface BridgeProgressProps {}

const BridgeProgress: VFC<IntrinsicElements["div"] & BridgeProgressProps> = (
	props
) => {
	const { txStatus, setTxStatus } = useBridge();

	return (
		<div {...props} css={styles.root(!!txStatus)}>
			{!!txStatus && (
				<div>
					{txStatus.status === "in-progress" && (
						<CircularProgress css={styles.status} size="3em" />
					)}
					{txStatus.status === "success" && (
						<CheckCircleOutlinedIcon
							css={[styles.status, styles.statusSuccess]}
						/>
					)}
					{txStatus.status === "fail" && (
						<ErrorOutlineOutlinedIcon
							css={[styles.status, styles.statusFail]}
						/>
					)}

					<div css={styles.title}>{txStatus.title}</div>
					<div css={styles.message}>{txStatus.message}</div>

					{txStatus.status !== "in-progress" && (
						<StandardButton
							css={styles.button}
							onClick={() => setTxStatus(null)}
						>
							Dismiss
						</StandardButton>
					)}
				</div>
			)}
		</div>
	);
};

export default BridgeProgress;

const styles = {
	root:
		(show: boolean) =>
		({ transitions }: Theme) =>
			css`
				position: absolute;
				inset: 0;
				background-color: rgba(255, 255, 255, 0.9);
				z-index: 100;
				opacity: ${show ? 1 : 0};
				pointer-events: ${show ? "all" : "none"};
				transition: opacity ${transitions.duration.short}ms;
				display: flex;
				align-items: center;
				justify-content: center;
				backdrop-filter: blur(2px);
				padding: 5em;
				text-align: center;
				font-size: 14px;
			`,

	status: css`
		margin-bottom: 1.5em;
	`,

	statusSuccess: ({ palette }: Theme) => css`
		width: 4em;
		height: 4em;
		font-size: 14px;
		color: ${palette.success.main};
	`,

	statusFail: ({ palette }: Theme) => css`
		width: 4em;
		height: 4em;
		font-size: 14px;
		color: ${palette.warning.main};
	`,

	title: ({ palette }: Theme) => css`
		font-weight: bold;
		font-size: 20px;
		line-height: 1;
		text-align: center;
		text-transform: uppercase;
		color: ${palette.primary.main};
	`,

	message: ({ palette }: Theme) => css`
		margin-top: 1em;
		line-height: 1.5;

		small {
			font-size: 0.85em;
			display: inline-block;
			padding: 0.25em 0.5em;
			margin-top: 0.5em;
		}

		em {
			font-weight: bold;
			font-style: normal;
			color: ${palette.primary.main};
			font-size: 0.5em;
			span {
				font-size: 2em;
				letter-spacing: -0.025em;
			}
		}
	`,

	button: css`
		margin-top: 2em;
	`,
};
