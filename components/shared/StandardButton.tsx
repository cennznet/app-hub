import { FC, ButtonHTMLAttributes } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";

interface StandardButtonProps {
	variant?: "primary" | "secondary";
}
const StandardButton: FC<
	ButtonHTMLAttributes<HTMLButtonElement> & StandardButtonProps
> = ({ children, variant = "primary", ...props }) => {
	return (
		<button css={[styles.root, styles[variant]]} {...props}>
			{children}
		</button>
	);
};

export default StandardButton;

const styles = {
	root: ({ palette, transitions }: Theme) => css`
		display: inline-block;
		padding: 0.5em 1em;
		border-radius: 4px;
		background-color: white;
		font-weight: bold;
		text-transform: uppercase;
		cursor: pointer;

		transition: background-color ${transitions.duration.short}ms,
			color ${transitions.duration.short}ms;
	`,

	primary: ({ palette, transitions }: Theme) => css`
		border: 1px solid ${palette.primary.main};
		color: ${palette.primary.main};
		&:hover {
			background-color: ${palette.primary.main};
			color: white;
		}
	`,

	secondary: ({ palette, transitions }: Theme) => css`
		border: 1px solid white;
		color: ${palette.text.secondary};

		&: hover {
			background-color: white;
			color: ${palette.text.highlight};
		}
	`,
};
