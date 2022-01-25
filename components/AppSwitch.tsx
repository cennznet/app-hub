import React from "react";
import { Box } from "@mui/material";
import { SwitchButton } from "../theme/StyledComponents";
import { useCENNZApi } from "../providers/CENNZApiProvider";

const Switch: React.FC<{ location: string; setLocation: Function }> = ({
	location,
	setLocation,
}) => {
	const { api } = useCENNZApi();
	const indexColours = location === undefined || location === "index";

	async function switchLocation(location: string) {
		if (api && api.isConnected) await api.disconnect();
		setLocation(location);
	}

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				marginTop: "2%",
			}}
		>
			{indexColours && (
				<>
					<SwitchButton
						onClick={() => switchLocation("bridge")}
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderRight: "2px solid #1130FF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						onClick={() => switchLocation("exchange")}
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
							borderLeft: "2px solid #1130FF",
						}}
					>
						exchange
					</SwitchButton>
				</>
			)}
			{location === "bridge" && (
				<>
					<SwitchButton
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#1130FF",
							color: "#FFFFFF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						onClick={() => switchLocation("exchange")}
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						exchange
					</SwitchButton>
				</>
			)}
			{location === "exchange" && (
				<>
					<SwitchButton
						onClick={() => switchLocation("bridge")}
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#FFFFFF",
							color: "#1130FF",
						}}
					>
						bridge
					</SwitchButton>
					<SwitchButton
						style={{
							left: "calc(50% - 276px/2 - 138px)",
							backgroundColor: "#1130FF",
							color: "#FFFFFF",
						}}
					>
						exchange
					</SwitchButton>
				</>
			)}
		</Box>
	);
};

export default Switch;
