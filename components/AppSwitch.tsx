import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { SwitchButton } from "@/components/StyledComponents";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";
import { SectionUri } from "@/types";

const Switch: React.FC<{}> = () => {
	const { pathname } = useRouter();
	const theme = useTheme();
	const section = useMemo<SectionUri>(() => {
		const section = pathname.replace("/", "").trim();
		return section as SectionUri;
	}, [pathname]);
	return (
		<Box
			style={{ "--section-color": theme.palette.primary[section] } as any}
			sx={{
				width: "360px",
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "flex-start",
				margin: "3em auto",
				filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.12))",
				borderRadius: "4px",
				overflow: "hidden",
				position: "relative",
			}}
		>
			<Link href="/swap" passHref={true}>
				<SwitchButton active={section === "swap"} paletteKey={section}>
					Swap
				</SwitchButton>
			</Link>
			<Link href="/pool" passHref={true}>
				<SwitchButton active={section === "pool"} paletteKey={section}>
					Pool
				</SwitchButton>
			</Link>
			<Link href="/bridge" passHref={true}>
				<SwitchButton active={section === "bridge"} paletteKey={section}>
					Bridge
				</SwitchButton>
			</Link>
		</Box>
	);
};

export default Switch;
