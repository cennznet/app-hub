import React, { useEffect } from "react";
import { Box } from "@mui/material";
import PoolProvider from "@/providers/PoolProvider";
import PoolForm from "@/components/pool/PoolForm";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import generateGlobalProps from "@/utils/generateGlobalProps";

export async function getStaticProps() {
	return {
		props: {
			...(await generateGlobalProps()),
		},
	};
}

const Pool: React.FC<{}> = () => {
	const { api, initApi } = useCENNZApi();

	useEffect(() => {
		if (!api?.isConnected) {
			initApi();
		}
	}, [api, initApi]);

	return (
		<PoolProvider>
			<Box
				sx={{
					position: "absolute",
					top: "131px",
					left: "calc(50% - 552px/2)",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<PoolForm />
			</Box>
		</PoolProvider>
	);
};

export default Pool;
