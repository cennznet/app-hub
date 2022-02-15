import { styled } from "@mui/material/styles";
import { Typography, Box, Button } from "@mui/material";

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
	fontFamily: "Teko",
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

	background: "#FFFFFF",
	border: "4px solid #1130FF",
	boxSizing: "border-box",
	boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
});

export const Option = styled(Button)({
	background: "#FFFFFF",
	border: "4px solid #1130FF",
});

export const SwitchButton = styled(Button)({
	backgroundColor: "#FFFFFF",
	position: "static",
	height: "48px",
	maxWidth: "120px",
	top: "0%",
	bottom: "0%",
	flex: "none",
	order: 0,
	alignSelf: "stretch",
	flexGrow: 1,
	margin: "0px 0px",
	fontWeight: "500",
	fontSize: "14px",
	lineHeight: "16px",
	letterSpacing: "1.25px",
});

export const SettingsText = styled(Typography)({
	fontSize: "14px",
	lineHeight: "17.5px",
	fontWeight: "500",
	letterSpacing: "1.2px",
});
