import { FC, useMemo } from "react";
import {
	ThemeProvider as MuiThemeProvider,
	createTheme,
	Theme,
} from "@mui/material/styles";
import useSectionUri from "@/hooks/useSectionUri";

declare module "@mui/material/styles/createPalette" {
	export interface TypeText {
		highlight?: string;
	}

	export interface SimplePaletteColorOptions {
		swap?: string;
		pool?: string;
		bridge?: string;
		default?: string;
	}

	export interface PaletteColor {
		swap?: string;
		pool?: string;
		bridge?: string;
		default?: string;
	}
}

const config = {
	palette: {
		primary: {
			main: "#1130FF",
			default: "#1130FF",
			swap: "#1130FF",
			pool: "#9847FF",
			bridge: "#2DC8CB",
		},
		secondary: {
			main: "rgba(17, 48, 255, 0.35)",
			default: "rgba(17, 48, 255, 0.35)",
			swap: "rgba(17, 48, 255, 0.35)",
			pool: "rgba(152, 71, 255, 0.35)",
			bridge: "rgba(45, 200, 203, 0.35)",
		},
		error: {
			main: "#EC022C",
		},
		text: {
			primary: "#020202",
			secondary: "#979797",
			highlight: "#1130FF",
		},
	},
	typography: {
		fontFamily: ["Roboto", "sans-serif"].join(","),
	},
	shape: {
		borderRadius: 0,
	},
	components: {
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
			},
		},
	},
};

const ThemeProvider: FC<{}> = (props) => {
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
			},
		});
	}, [section]);

	return <MuiThemeProvider {...props} theme={theme} />;
};

export default ThemeProvider;
