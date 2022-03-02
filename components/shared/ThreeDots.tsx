import { FC } from "react";
import { css } from "@emotion/react";

interface ThreeDotsProps {
	fontSize?: number;
}

const ThreeDots: FC<ThreeDotsProps> = ({ fontSize = 16 }) => {
	return (
		<div css={styles.root(fontSize)}>
			<span>.</span>
			<span>.</span>
			<span>.</span>
		</div>
	);
};

export default ThreeDots;

export const styles = {
	root: (fontSize: number) =>
		css`
			font-size: ${fontSize}px;
			@keyframes dot {
				0% {
					opacity: 0;
				}
				50% {
					opacity: 1;
				}
				100% {
					opacity: 0;
				}
			}

			display: inline-block;
			span {
				opacity: 0;
				animation: dot 1s infinite;

				&:nth-of-type(1) {
					animation-delay: 0s;
				}

				&:nth-of-type(2) {
					animation-delay: 0.1s;
				}

				&:nth-of-type(3) {
					animation-delay: 0.2s;
				}
			}
		`,
};
