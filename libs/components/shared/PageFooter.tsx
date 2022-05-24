import { FC } from "react";
import { COMMIT_SHA, APP_VERSION } from "@/libs/constants";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";

const PageFooter: FC = () => {
	const shortenCommitSha = COMMIT_SHA ? COMMIT_SHA.substring(0, 10) : "";

	return (
		<div css={styles.root}>
			<pre>
				v{APP_VERSION}
				{shortenCommitSha ? ` @ ${shortenCommitSha}` : ""}
			</pre>
		</div>
	);
};

export default PageFooter;

const styles = {
	root: ({ palette }: Theme) => css`
		position: fixed;
		left: 1em;
		bottom: 1em;
		z-index: 10;
		font-size: 0.75em;
		color: ${palette.grey["800"]};
	`,
};
