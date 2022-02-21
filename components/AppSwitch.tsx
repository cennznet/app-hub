import React from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import {
	ActiveSwitchButton,
	SwitchButton,
} from "@/components/StyledComponents";
import Link from "next/link";

const Switch: React.FC<{}> = () => {
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
			}}
		>
			{location === "/" && (
				<>
					<ActiveSwitchButton
						sx={{
							color: "primary.swap",
							borderBottom: (theme) =>
								`2px solid ${theme.palette.primary.swap}`,
						}}
					>
						swap
					</ActiveSwitchButton>
					<Link href="/pool" passHref={true}>
						<SwitchButton>
							<span>pool</span>
						</SwitchButton>
					</Link>
					<Link href="/bridge" passHref={true}>
						<SwitchButton>
							<span>bridge</span>
						</SwitchButton>
					</Link>
				</>
			)}
			{location === "/pool" && (
				<>
					<Link href="/" passHref={true}>
						<SwitchButton>
							<span>swap</span>
						</SwitchButton>
					</Link>
					<ActiveSwitchButton
						sx={{
							color: "primary.pool",
							borderBottom: (theme) =>
								`2px solid ${theme.palette.primary.pool}`,
						}}
					>
						pool
					</ActiveSwitchButton>
					<Link href="/bridge" passHref={true}>
						<SwitchButton>
							<span>bridge</span>
						</SwitchButton>
					</Link>
				</>
			)}
			{location === "/bridge" && (
				<>
					<Link href="/" passHref={true}>
						<SwitchButton>
							<span>swap</span>
						</SwitchButton>
					</Link>
					<Link href="/pool" passHref={true}>
						<SwitchButton>
							<span>pool</span>
						</SwitchButton>
					</Link>
					<ActiveSwitchButton
						sx={{
							color: "primary.bridge",
							borderBottom: (theme) =>
								`2px solid ${theme.palette.primary.bridge}`,
						}}
					>
						bridge
					</ActiveSwitchButton>
				</>
			)}
		</Box>
	);
};

export default Switch;
