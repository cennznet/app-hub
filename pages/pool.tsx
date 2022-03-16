import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchPoolAssets from "@/utils/fetchPoolAssets";
import { API_URL } from "@/constants";
import generateGlobalProps from "@/utils/generateGlobalProps";
import MainPanel from "@/components/MainPanel";
import PoolProvider from "@/providers/PoolProvider";
import { VFC } from "react";
import PoolForm from "@/components/PoolForm";
import PoolActionsPair from "@/components/PoolActionsPair";
import PoolAssetsPair from "@/components/PoolAssetsPair";
import PoolStats from "@/components/PoolStats";
import PoolSettings from "@/components/PoolSettings";

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
	return (
		<PoolProvider supportedAssets={supportedAssets}>
			<MainPanel defaultTitle="Pool">
				<PoolForm>
					<PoolActionsPair />
					<PoolAssetsPair />
					<PoolStats />
					<PoolSettings />
				</PoolForm>
			</MainPanel>
		</PoolProvider>
	);
};

export default Pool;
