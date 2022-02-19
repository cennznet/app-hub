import React, { useEffect } from "react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import Swap from "@/pages/swap";

const Home: React.FC<{}> = () => {
	const { api, initApi } = useCENNZApi();

	useEffect(() => {
		if (!api?.isConnected) {
			initApi();
		}
	}, [api, initApi]);

	return <Swap />;
};

export default Home;
