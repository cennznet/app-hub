import { FC, ComponentProps, useState, useCallback } from "react";
import { css } from "@emotion/react";
import SwapHoriz from "@mui/icons-material/SwapHoriz";
import { Theme } from "@mui/material";

interface SwapButtonProps {
	vertical?: boolean;
}

const SwapButton: FC<SwapButtonProps & ComponentProps<"button">> = ({
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
		<button css={styles.root} {...props} onClick={onButtonClick} type="button">
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
			border-color: ${palette.primary.main};
			svg {
				color: ${palette.primary.main};
			}
		}
	`,

	icon:
		(vertical: boolean) =>
		({ palette }: Theme) =>
			css`
				width: 60%;
				height: 60%;
				transition: color 0.2s, transform 0.2s ease-out;
				transform: ${vertical ? "rotateZ(90deg)" : "rotateZ(0deg)"};
				color: ${palette.text.primary};
			`,

	iconSpin: (vertical: boolean) => css`
		transform: ${vertical ? "rotateZ(270deg)" : "rotateZ(180deg)"};
	`,
};
