import { FC } from "react";
import {
	ThemeProvider as MuiThemeProvider,
	createTheme,
} from "@mui/material/styles";

declare module "@mui/material/styles" {
	interface PaletteColorOptions {
		main: string;
		swap?: string;
		pool?: string;
		bridge?: string;
	}

	interface PaletteColor {
		main: string;
		swap?: string;
		pool?: string;
		bridge?: string;
	}
}

const theme = createTheme({
	palette: {
		primary: {
			main: "#1130FF",
			swap: "#1130FF",
			pool: "#9847FF",
			bridge: "#2DC8CB",
		},
		secondary: {
			main: "#B3BDFF",
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
		MuiBackdrop: {
			styleOverrides: {
				root: {
					opacity: "0.3",
				},
			},
		},
	},
});

const ThemeProvider: FC<{}> = (props) => {
	return <MuiThemeProvider {...props} theme={theme} />;
};

export default ThemeProvider;
