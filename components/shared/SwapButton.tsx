import { FC, ComponentProps, useState, useCallback } from "react";
import { css } from "@emotion/react";
import SwapHoriz from "@mui/icons-material/SwapHoriz";
import { Theme } from "@mui/material";

const SwapButton: FC<{ vertical?: boolean } & ComponentProps<"button">> = ({
	vertical = false,
	onClick,
	...props
}) => {
	const [alt, setAlt] = useState<boolean>(false);

	const onButtonClick = useCallback(
		(event) => {
			setAlt((alt) => !alt);
			onClick?.(event);
		},
		[onClick]
	);

	return (
		<button css={styles.root} {...props} onClick={onButtonClick}>
			<div css={styles.inner}>
				<SwapHoriz
					css={[styles.icon(vertical), alt && styles.iconSpin(vertical)]}
				/>
			</div>
		</button>
	);
};

export default SwapButton;

const styles = {
	root: css`
		display: inline-block;
	`,

	inner: ({ palette }: Theme) => css`
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px solid ${palette.text.secondary};
		border-radius: 4px;
		cursor: pointer;
		transition: border-color 0.2s, background-color 0.2s;

		&:hover {
			border-color: ${palette.text.highlight};
			svg {
				color: ${palette.text.highlight};
			}
		}
	`,

	icon:
		(vertical) =>
		({ palette }: Theme) =>
			css`
				width: 60%;
				height: 60%;
				transition: color 0.2s, transform 0.2s ease-out;
				transform: ${vertical ? "rotateZ(90deg)" : "rotateZ(0deg)"};
				color: ${palette.text.primary};
			`,

	iconSpin: (vertical) => css`
		transform: ${vertical ? "rotateZ(270deg)" : "rotateZ(180deg)"};
	`,
};