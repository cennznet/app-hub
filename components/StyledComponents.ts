import { styled } from "@mui/material/styles";
import { Typography, Box, Button, ButtonProps } from "@mui/material";

export const Frame = styled(Box)({
	position: "absolute",
	border: "2.5px solid #1130FF",
	width: "245px",
	height: "45px",
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
});

export const Heading = styled(Typography)({
	fontStyle: "normal",
	fontWeight: "bold",
	lineHeight: "125%",
	letterSpacing: "0.5px",
});

export const SmallText = styled(Typography)({
	fontSize: "16px",
	lineHeight: "125%",
	marginRight: "10px",
});

export const StyledModal = styled(Box)({
	position: "absolute",
	width: "48%",
	height: "auto",
	left: "26%",
	top: "20%",
	background: "white",
	border: "4px solid #1130FF",
	boxSizing: "border-box",
	boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
});

export const Option = styled(Button)({
	background: "white",
	border: "4px solid #1130FF",
});

interface SwitchButtonProps extends ButtonProps {
	active?: boolean;
	paletteKey?: string;
}

export const SwitchButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== "active" && prop !== "paletteKey",
})<SwitchButtonProps>(({ active, paletteKey, theme }) => ({
	"backgroundColor": "white",
	"position": "static",
	"height": "48px",
	"maxWidth": "120px",
	"top": "0%",
	"bottom": "0%",
	"flex": "none",
	"order": 0,
	"alignSelf": "stretch",
	"flexGrow": 1,
	"margin": "0px 0px",
	"fontWeight": "500",
	"fontSize": "14px",
	"lineHeight": "16px",
	"letterSpacing": "1.25px",
	"color": active ? theme.palette.primary[paletteKey] : "rgba(17,48,255,0.5)",
	"borderBottom": active
		? `2px solid ${theme.palette.primary[paletteKey]}`
		: "2px solid white",
	"transition": "color 0.2s",
	"cursor": active && "default",
	"&:hover": {
		color: "var(--section-color)",
		borderBottom: "2px solid var(--section-color)",
		backgroundColor: "white !important",
	},
}));

export const SettingsText = styled(Typography)({
	fontSize: "14px",
	lineHeight: "17.5px",
	fontWeight: "500",
	letterSpacing: "1.2px",
});

export const PoolSummaryBox = styled(Box)({
	display: "flex",
	flexDirection: "row",
	marginLeft: "30px",
});

export const PoolSummaryText = styled(Typography)({
	fontSize: "16px",
	lineHeight: "175%",
});

export const PoolSummaryBoldText = styled(Typography)({
	color: "#6200EE",
	fontSize: "16px",
	lineHeight: "175%",
	fontWeight: "bold",
});
