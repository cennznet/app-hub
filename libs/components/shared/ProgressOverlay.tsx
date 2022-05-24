import { IntrinsicElements } from "@/libs/types";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { FC, memo, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";

interface ProgressOverlayProps {
	show: boolean;
	dismissible: boolean;
	onRequestClose?: () => void;
}

const ProgressOverlay: FC<ProgressOverlayProps & IntrinsicElements["div"]> = ({
	show,
	dismissible,
	onRequestClose,
	children,
	...props
}) => {
	useEffect(() => {
		if (!dismissible) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			onRequestClose?.();
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [onRequestClose, dismissible]);

	return (
		<div {...props} css={styles.root(show)}>
			{dismissible && (
				<CloseIcon css={styles.closeIcon} onClick={onRequestClose} />
			)}
			{children}
		</div>
	);
};

export default memo(ProgressOverlay);

const styles = {
	root:
		(show: boolean) =>
		({ transitions, palette }: Theme) =>
			css`
				position: absolute;
				inset: 0;
				background-color: rgba(255, 255, 255, 0.9);
				z-index: 100;
				opacity: ${show ? 1 : 0};
				pointer-events: ${show ? "all" : "none"};
				transition: opacity ${transitions.duration.short}ms;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				backdrop-filter: blur(2px);
				padding: 5em;
				text-align: center;
				font-size: 14px;

				h1 {
					font-weight: bold;
					font-size: 20px;
					line-height: 1;
					text-align: center;
					text-transform: uppercase;
					color: ${palette.primary.main};

					span {
						text-transform: none;
					}
				}

				p {
					margin-top: 1em;
					line-height: 1.5;

					small {
						font-size: 0.85em;
						display: inline-block;
						padding: 0.25em 0.5em;
						margin-top: 0.5em;
					}

					em {
						font-family: "Roboto Mono", monospace;
						display: inline;
						letter-spacing: -0.025em;
						font-weight: bold;
						font-style: normal;
						color: ${palette.primary.main};
						font-size: 0.5em;
						span {
							font-size: 2em;
							letter-spacing: -0.025em;
						}
					}
				}
			`,
	closeIcon: ({ palette }: Theme) => css`
		position: absolute;
		top: 1em;
		right: 1em;
		cursor: pointer;
		transition: color 0.2s;
		color: ${palette.grey["600"]};

		&:hover {
			color: ${palette.primary.main};
		}
	`,
};
