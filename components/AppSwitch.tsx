import React from "react";
import { Box } from "@mui/material";
import { SwitchButton } from "../theme/StyledComponents";

const Switch: React.FC<{ location: string; setLocation: Function }> = ({
	location,
	setLocation,
}) => {
	const indexColours = location === undefined || location === "index";

	return (
		<Box
			sx={{
				width: "552px",
				left: "calc(50% - 552px/2)",
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				position: "absolute",
				top: "4%",
			}}
		>
			{indexColours && (
				<>
					<SwitchButton
						onClick={() => setLocation("swap")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderLeft: "2px solid #1130FF",
							borderRight: "2px solid #1130FF",
						}}
					>
						swap
					</SwitchButton>
					<SwitchButton
						onClick={() => setLocation("bridge")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderRight: "2px solid #1130FF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						onClick={() => setLocation("pool")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderLeft: "2px solid #1130FF",
						}}
					>
						pool
					</SwitchButton>
				</>
			)}
			{location === "bridge" && (
				<>
					<SwitchButton
						onClick={() => setLocation("swap")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						swap
					</SwitchButton>
					<SwitchButton
						style={{
							backgroundColor: "#1130FF",
							color: "#FFFFFF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						onClick={() => setLocation("pool")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderLeft: "2px solid #1130FF",
						}}
					>
						pool
					</SwitchButton>
				</>
			)}
			{location === "swap" && (
				<>
					<SwitchButton
						style={{
							backgroundColor: "#1130FF",
							color: "#FFFFFF",
						}}
					>
						swap
					</SwitchButton>
					<SwitchButton
						onClick={() => setLocation("bridge")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						onClick={() => setLocation("pool")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderLeft: "2px solid #1130FF",
						}}
					>
						pool
					</SwitchButton>
				</>
			)}
			{location === "pool" && (
				<>
					<SwitchButton
						onClick={() => setLocation("swap")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						swap
					</SwitchButton>
					<SwitchButton
						onClick={() => setLocation("bridge")}
						style={{
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						style={{
							backgroundColor: "#1130FF",
							color: "#FFFFFF",
							borderLeft: "2px solid #1130FF",
						}}
					>
						pool
					</SwitchButton>
				</>
			)}
		</Box>
	);
};

export default Switch;
