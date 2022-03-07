import { VFC } from "react";
import { css } from "@emotion/react";
import { GlobalStyles } from "@mui/material";

const globalStyles = (
	<GlobalStyles
		styles={css`
			html {
				scroll-behavior: smooth;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}

			body {
				font-size: 16px;
				line-height: 1.25;
			}

			input {
				font-family: inherit;
				font-size: inherit;
			}

			button {
				background-color: transparent;
				border-width: 0;
				font-family: inherit;
				font-size: inherit;
				font-style: inherit;
				font-weight: inherit;
				line-height: inherit;
				padding: 0;
			}

			.MuiCircularProgress-root {
				animation-duration: 0.7s;
			}

			.MuiAccordionSummary-root {
				min-height: 0;
				&.Mui-expanded {
					min-height: 0;
				}
			}

			.MuiAccordionSummary-content {
				margin-top: 1em;
				margin-bottom: 1em;
				&.Mui-expanded {
					margin-top: 1em;
					margin-bottom: 1em;
				}
			}

			.MuiAccordionDetails-root {
				padding: 0;
			}
		`}
	/>
);

const CssGlobal: VFC<{}> = () => {
	return globalStyles;
};

export default CssGlobal;
