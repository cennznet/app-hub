import React from "react";
import { css } from "@emotion/react";
import PoolProvider from "@/providers/PoolProvider";
import PoolForm from "@/components/pool/PoolForm";
import generateGlobalProps from "@/utils/generateGlobalProps";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";

export async function getStaticProps() {
	return {
		props: {
			...(await generateGlobalProps()),
		},
	};
}

const Pool: React.FC<{}> = () => {
	const { api } = useCENNZApi();
	const { selectedAccount } = useCENNZWallet();

	return (
		<PoolProvider api={api} selectedAccount={selectedAccount}>
			<div css={styles.poolContainer}>
				<PoolForm />
			</div>
		</PoolProvider>
	);
};

export default Pool;

export const styles = {
	poolContainer: css`
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 550px;
		border-radius: 4px;
		margin: 0 auto 5em;
		position: relative;
		background-color: #ffffff;
		box-shadow: 4px 8px 8px rgba(17, 48, 255, 0.1);
	`,
};
