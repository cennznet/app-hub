import { VFC } from "react";
import { css } from "@emotion/react";
import { GlobalStyles } from "@mui/material";
import { Theme } from "@mui/material";

const globalStyles = (
	<GlobalStyles
		styles={({ palette, transitions, shadows }: Theme) => css`
			html {
				scroll-behavior: smooth;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
			}

			body {
				font-size: 16px;
				line-height: 1.25;
				letter-spacing: 0;
				color: ${palette.text.primary};
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

			pre {
				font-family: "Roboto Mono", monospace;
				display: inline;
				letter-spacing: -0.025em;
			}

			#__next {
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
					&.Mui-expanded {
					}
				}

				.MuiAccordionDetails-root {
					padding: 0;
				}

				.MuiOutlinedInput-root {
					border-radius: 4px;
					line-height: 1;

					&:hover,
					&:active,
					&.Mui-focused {
						.MuiOutlinedInput-notchedOutline {
							border-color: ${palette.primary.main};
							border-width: 1px;
						}
					}

					.MuiOutlinedInput-input {
						padding: 0.78125em;
					}

					.MuiOutlinedInput-input:not(.MuiSelect-select) {
						font-family: "Roboto Mono", monospace;
					}

					.MuiOutlinedInput-notchedOutline {
						border-color: ${palette.text.secondary};
					}

					.MuiSelect-select[aria-expanded="true"] {
						color: ${palette.primary.main};

						.MuiSvgIcon-root {
							color: ${palette.primary.main};
						}
					}

					.MuiList-root {
						padding: 0;
					}

					.MuiSvgIcon-root {
						transition: transform ${transitions.duration.shortest}ms
							${transitions.easing.easeInOut};
					}

					.MuiSelect-iconOpen {
						color: ${palette.primary.main};
					}
				}
			}

			.MuiTooltip-popper {
				font-weight: normal;
				.MuiTooltip-tooltip {
					border-radius: 4px;
					background-color: white;
					color: ${palette.text.primary};
					padding: 1em;
					box-shadow: 4px 8px 8px rgba(0, 0, 0, 0.1);
					border: 1px solid ${palette.secondary.main};
				}

				.MuiTooltip-arrow {
					color: white;
					&:before {
						outline: 1px solid ${palette.secondary.main};
					}
				}
			}
		`}
	/>
);

const CssGlobal: VFC<{}> = () => {
	return globalStyles;
};

export default CssGlobal;
