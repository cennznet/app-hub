import React from "react";
import Link from "next/link";
import { isBrowser, isTablet } from "react-device-detect";
import { Box } from "@mui/system";

const CENNZnetHeader: React.FC<{}> = () => {
	return (
		<Link href="/" passHref>
			<Box sx={{ cursor: "pointer" }}>
				<img
					src="/cennznet-header.png"
					alt="CENNZnet header"
					style={{
						width: isBrowser || isTablet ? "90px" : "45px",
						position: "absolute",
						top: "5%",
						left: "6%",
					}}
				/>
			</Box>
		</Link>
	);
};

export default CENNZnetHeader;
