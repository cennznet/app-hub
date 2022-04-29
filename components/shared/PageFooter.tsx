import { VFC } from "react";
import { version } from "@/package.json";
import { COMMIT_SHA } from "@/constants";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";

const PageFooter: VFC<{}> = () => {
	const shortenCommitSha = COMMIT_SHA ? COMMIT_SHA.substring(0, 10) : "";

	return (
		<div css={styles.root}>
			<pre>
				v{version}
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
