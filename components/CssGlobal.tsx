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
			`}
		/>
	);
};

export default CssGlobal;
