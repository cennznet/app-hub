import React from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { SwitchButton } from "@/components/StyledComponents";

const Switch: React.FC<{ setLocation: Function }> = ({ setLocation }) => {
	const router = useRouter();
	const location = router.asPath;

	return (
		<Box
			sx={{
				width: "360px",
				left: "calc(50% - 360px/2)",
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "flex-start",
				padding: 0,
				position: "absolute",
				top: "4%",
				filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.12))",
				borderRadius: "4px",
				overflow: "hidden",
			}}
		>
			{location === "/" && (
				<>
					<SwitchButton
						sx={{
							color: "primary.swap",
							borderBottom: "2px solid #1130FF",
						}}
					>
						swap
					</SwitchButton>
					<SwitchButton onClick={() => setLocation("pool")}>
						<span>pool</span>
					</SwitchButton>
					<SwitchButton onClick={() => setLocation("bridge")}>
						<span>bridge</span>
					</SwitchButton>
				</>
			)}
			{location === "/pool" && (
				<>
					<SwitchButton onClick={() => setLocation("")}>
						<span>swap</span>
					</SwitchButton>
					<SwitchButton
						sx={{
							color: "primary.pool",
							borderBottom: "2px solid #9847FF",
						}}
					>
						pool
					</SwitchButton>
					<SwitchButton onClick={() => setLocation("bridge")}>
						<span>bridge</span>
					</SwitchButton>
				</>
			)}
			{location === "/bridge" && (
				<>
					<SwitchButton onClick={() => setLocation("")}>
						<span>swap</span>
					</SwitchButton>
					<SwitchButton onClick={() => setLocation("pool")}>
						<span>pool</span>
					</SwitchButton>
					<SwitchButton
						sx={{
							color: "primary.bridge",
							borderBottom: "2px solid #2DC8CB",
						}}
					>
						bridge
					</SwitchButton>
				</>
			)}
		</Box>
	);
};

export default Switch;
