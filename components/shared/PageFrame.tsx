import { FC } from "react";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";

const PageFrame: FC<{}> = () => {
	return <div css={styles.container} />;
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
};
