import { FC } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import Link from "next/link";
import CENNZLogoSVG from "@vectors/cennznet-logo.svg";

const PageFrame: FC = () => {
	return (
		<div css={styles.container}>
			<Link href="/pages">
				<a css={styles.logo}>
					<img src={CENNZLogoSVG.src} alt="CENNZnet" />
				</a>
			</Link>
		</div>
	);
};

export default PageFrame;

export const styles = {
	container: ({ palette, transitions }: Theme) =>
		css`
			position: fixed;
			inset: 0;
			z-index: 1000;
			pointer-events: none;
			border: 8px solid ${palette.primary.main};
			transition: boder-color ${transitions.duration.standard}ms;
		`,

	logo: ({ palette, transitions }: Theme) =>
		css`
			width: 140px;
			height: 140px;
			display: flex;
			background-color: ${palette.primary.main};
			transition: background-color ${transitions.duration.standard}ms;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 10;

			> img {
				display: block;
				margin: auto;
			}
		`,
};
