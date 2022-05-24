import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchPoolAssets from "@/utils/fetchPoolAssets";
import { API_URL } from "@/constants";
import generateGlobalProps from "@/utils/generateGlobalProps";
import MainPanel from "@/components/MainPanel";
import PoolProvider from "@/providers/PoolProvider";
import { FC, memo } from "react";
import PoolForm from "@/components/PoolForm";
import PoolActionsPair from "@/components/PoolActionsPair";
import PoolAssetsPair from "@/components/PoolAssetsPair";
import PoolStats from "@/components/PoolStats";
import PoolSettings from "@/components/PoolSettings";
import PoolProgress from "@/components/PoolProgress";
import { NextSeo } from "next-seo";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			supportedAssets: await fetchPoolAssets(api),
			...(await generateGlobalProps("pool")),
		},
	};
}

interface PoolProps {
	supportedAssets: CENNZAsset[];
}

const Pool: FC<PoolProps> = ({ supportedAssets }) => {
	return (
		<PoolProvider supportedAssets={supportedAssets}>
			<NextSeo title="CENNZX Liquidity" />
			<MainPanel defaultTitle="CENNZX Liquidity">
				<PoolForm>
					<PoolActionsPair />
					<PoolAssetsPair />
					<PoolStats />
					<PoolSettings />
				</PoolForm>
				<PoolProgress />
			</MainPanel>
		</PoolProvider>
	);
};

export default memo(Pool);
