import React from "react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import PoolProvider from "@/providers/PoolProvider";
import PoolForm from "@/components/pool/PoolForm";
import generateGlobalProps from "@/utils/generateGlobalProps";
import styles from "@/styles/pages/pool.module.css";
import { useWallet } from "@/providers/SupportedWalletProvider";

export async function getStaticProps() {
	return {
		props: {
			...(await generateGlobalProps()),
		},
	};
}

const Pool: React.FC<{}> = () => {
	const { api } = useCENNZApi();
	const { selectedAccount } = useWallet();

	return (
		<PoolProvider api={api} selectedAccount={selectedAccount}>
			<div className={styles.poolContainer}>
				<PoolForm />
			</div>
		</PoolProvider>
	);
};

export default Pool;
