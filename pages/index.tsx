import React, { useEffect } from "react";
import styles from "../styles/home.module.css";
import { useCENNZApi } from "../providers/CENNZApiProvider";

const Home: React.FC<{}> = () => {
	const { api, initApi } = useCENNZApi();

	useEffect(() => {
		if (!api?.isConnected) {
			initApi();
		}
	}, [api, initApi]);

	return <div className={styles.container}></div>;
};

export default Home;
