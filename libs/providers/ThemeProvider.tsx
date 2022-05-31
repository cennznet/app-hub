import { FC, PropsWithChildren, useMemo } from "react";
import {
	ThemeProvider as MuiThemeProvider,
	createTheme,
	Theme,
} from "@mui/material/styles";
import { useSectionUri } from "@hooks";

declare module "@mui/material/styles/createPalette" {
	export interface TypeText {
		highlight?: string;
	}

	export interface SimplePaletteColorOptions {
		default?: string;
		swap?: string;
		pool?: string;
		bridge?: string;
	}

	export interface PaletteColor {
		default?: string;
		swap?: string;
		pool?: string;
		bridge?: string;
	}

	export interface TypeBackground {
		swap?: string;
		pool?: string;
		bridge?: string;
		main?: string;
	}
}

const config = {
	palette: {
		primary: {
			default: "#1130FF",
			swap: "#1130FF",
			pool: "#9847FF",
			bridge: "#2DC8CB",
		},
		secondary: {
			default: "#B3BDFF",
			swap: "#B3BDFF",
			pool: "#E4D1FF",
			bridge: "#B1EAEB",
		},
		info: {
			default: "#E4E7FF",
			swap: "#E4E7FF",
			pool: "#F5ECFF",
			bridge: "#E8F8F9",
		},
		background: {
			default: "rgba(228, 231, 255, 0.4)",
			swap: "rgba(228, 231, 255, 0.4)",
			pool: "rgba(245, 236, 255, 0.4)",
			bridge: "rgba(232, 248, 249, 0.4)",
		},
		text: {
			primary: "#020202",
			secondary: "#979797",
			disabled: "rgba(151, 151, 151, 0.25)",
		},
	},
	typography: {
		htmlFontSize: 16,
		fontSize: 14,
		fontFamily: ["Roboto", "sans-serif"].join(","),
	},
	shape: {
		borderRadius: 0,
	},
	transitions: {
		duration: {
			shortest: 150,
		},
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
			},
		},
	},
} as Partial<Theme>;

interface ThemeProviderProps {}

const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = (props) => {
	const section = useSectionUri();
	const theme = useMemo<Theme>(() => {
		return createTheme({
			...config,
			palette: {
				...config.palette,
				primary: {
					...config.palette.primary,
					main:
						config.palette.primary[section] || config.palette.primary.default,
				},

				secondary: {
					...config.palette.secondary,
					main:
						config.palette.secondary[section] ||
						config.palette.secondary.default,
				},

				info: {
					...config.palette.info,
					main: config.palette.info[section] || config.palette.info.default,
				},

				background: {
					...config.palette.background,
					main:
						config.palette.background[section] ||
						config.palette.background.default,
				},
			},
			shadows: [
				"none",
				"4px 8px 8px rgba(0, 0, 0, 0.1)",
				...new Array(23).fill("4px 8px 8px rgba(0, 0, 0, 0.1)"),
			] as any,
		});
	}, [section]);

	return <MuiThemeProvider {...props} theme={theme} />;
};

export default ThemeProvider;
