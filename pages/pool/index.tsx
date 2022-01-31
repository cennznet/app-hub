import React from "react";
import { Box } from "@mui/material";
import SupportedAssetsProvider from "../../providers/SupportedAssetsProvider";
import PoolProvider from "../../providers/PoolProvider";
import PoolForm from "../../components/pool/PoolForm";

const Pool: React.FC<{}> = () => {
	return (
		<SupportedAssetsProvider>
			<PoolProvider>
				<Box
					sx={{
						position: "absolute",
						top: "20%",
						left: "calc(50% - 552px/2)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<PoolForm />
				</Box>
			</PoolProvider>
		</SupportedAssetsProvider>
	);
};

export default Pool;
