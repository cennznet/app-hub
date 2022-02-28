import { createTheme } from "@mui/material/styles";

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
			swap: "#B3BDFF",
			pool: "#E4D1FF",
			bridge: "#B1EAEB",
		},
		error: {
			main: "#EC022C",
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

export default theme;
