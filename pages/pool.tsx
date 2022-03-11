import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchPoolAssets from "@/utils/fetchPoolAssets";
import { API_URL } from "@/constants";
import generateGlobalProps from "@/utils/generateGlobalProps";
import MainPanel from "@/components/MainPanel";
import PoolProvider from "@/providers/PoolProvider";
import { VFC } from "react";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			supportedAssets: await fetchPoolAssets(api),
			...(await generateGlobalProps("pool")),
		},
	};
}

const Pool: VFC<{ supportedAssets: CENNZAsset[] }> = ({ supportedAssets }) => {
	console.log({ supportedAssets });

	return (
		<PoolProvider supportedAssets={supportedAssets}>
			<MainPanel defaultTitle="Add to Pool"></MainPanel>
		</PoolProvider>
	);
};

export default Pool;
