import { IntrinsicElements } from "@/libs/types";
import { FC } from "react";
import MainPanelProvider from "@/libs/providers/MainPanelProvider";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";

interface MainPanel {
	defaultTitle: string;
}

const MainPanel: FC<IntrinsicElements["div"] & MainPanel> = ({
	defaultTitle,
	children,
	...props
}) => {
	return (
		<MainPanelProvider defaultTitle={defaultTitle}>
			<div {...props} css={styles.root}>
				<h1 css={styles.heading}>{defaultTitle}</h1>

				{children}
			</div>
		</MainPanelProvider>
	);
};

export default MainPanel;

const styles = {
	root: ({ shadows }: Theme) => css`
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 550px;
		border-radius: 4px;
		margin: 0 auto 5em;
		position: relative;
		background-color: #ffffff;
		box-shadow: ${shadows[1]};
		padding: 1.5em 2.5em 2.5em;
		overflow: hidden;
	`,

	heading: ({ palette }: Theme) => css`
		font-weight: bold;
		font-size: 20px;
		line-height: 1;
		text-align: center;
		text-transform: uppercase;
		color: ${palette.primary.main};
		margin-bottom: 1.5em;
	`,
};
