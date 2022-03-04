import { FC } from "react";
import { Global, css } from "@emotion/react";

const CssGlobal: FC<{}> = () => {
	return (
		<Global
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
					animation-timing-function: ease-in-out !important;
					animation-duration: 0.7s !important;
				}
			`}
		/>
	);
};

export default CssGlobal;
