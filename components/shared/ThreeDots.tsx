import { FC } from "react";
import { css } from "@emotion/react";

const ThreeDots: FC<{}> = () => {
	return (
		<div css={styles.root}>
			<span>.</span>
			<span>.</span>
			<span>.</span>
		</div>
	);
};

export default ThreeDots;

export const styles = {
	root: css`
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

			&:nth-child(1) {
				animation-delay: 0s;
			}

			&:nth-child(2) {
				animation-delay: 0.1s;
			}

			&:nth-child(3) {
				animation-delay: 0.2s;
			}
		}
	`,
};
