import React, { useEffect } from "react";
import PoolProvider from "@/providers/PoolProvider";
import PoolForm from "@/components/pool/PoolForm";
import generateGlobalProps from "@/utils/generateGlobalProps";
import styles from "@/styles/pages/pool.module.css";

export async function getStaticProps() {
	return {
		props: {
			...(await generateGlobalProps()),
		},
	};
}

const Pool: React.FC<{}> = () => {
	return (
		<PoolProvider>
			<div className={styles.poolContainer}>
				<PoolForm />
			</div>
		</PoolProvider>
	);
};

export default Pool;
