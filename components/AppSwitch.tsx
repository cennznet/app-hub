import React from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { SwitchButton } from "@/components/StyledComponents";
import Link from "next/link";

const Switch: React.FC<{}> = () => {
	const { asPath: location } = useRouter();

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
			}}
		>
			<Link href="/" passHref={location !== "/"}>
				<SwitchButton
					sx={
						location === "/" && {
							color: "primary.swap",
							borderBottom: (theme) =>
								`2px solid ${theme.palette.primary.swap}`,
						}
					}
					active={location === "/"}
				>
					swap
				</SwitchButton>
			</Link>
			<Link href="/pool" passHref={location !== "/pool"}>
				<SwitchButton
					active={location === "/pool"}
					sx={
						location === "/pool" && {
							color: "primary.pool",
							borderBottom: (theme) =>
								`2px solid ${theme.palette.primary.pool}`,
						}
					}
				>
					<span>pool</span>
				</SwitchButton>
			</Link>
			<Link href="/bridge" passHref={location !== "/bridge"}>
				<SwitchButton
					active={location === "/bridge"}
					sx={
						location === "/bridge" && {
							color: "primary.bridge",
							borderBottom: (theme) =>
								`2px solid ${theme.palette.primary.bridge}`,
						}
					}
				>
					<span>bridge</span>
				</SwitchButton>
			</Link>
		</Box>
	);
};

export default Switch;
