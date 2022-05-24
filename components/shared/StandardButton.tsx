import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import { FC, memo } from "react";
import { IntrinsicElements } from "@/types";

interface StandardButtonProps {
	variant?: "primary" | "secondary";
}
const StandardButton: FC<IntrinsicElements["button"] & StandardButtonProps> = ({
	children,
	variant = "primary",
	...props
}) => {
	return (
		<button css={[styles.root, styles[variant]]} {...props}>
			{children}
		</button>
	);
};

export default memo(StandardButton);

const styles = {
	root: ({ transitions }: Theme) => css`
		display: inline-block;
		padding: 0.75em 1.5em;
		border-radius: 4px;
		background-color: white;
		font-weight: bold;
		text-transform: uppercase;
		cursor: pointer;
		font-size: 14px;

		transition: background-color ${transitions.duration.short}ms,
			color ${transitions.duration.short}ms;
	`,

	primary: ({ palette }: Theme) => css`
		border: 1px solid ${palette.primary.main};
		color: ${palette.primary.main};
		&:hover {
			background-color: ${palette.primary.main};
			color: white;
		}
	`,

	secondary: ({ palette }: Theme) => css`
		border: 1px solid white;
		color: ${palette.grey["600"]};

		&:hover {
			background-color: white;
			color: ${palette.primary.main};
		}
	`,
};
