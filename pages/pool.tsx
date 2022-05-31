import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/libs/types";
import fetchPoolAssets from "@utils/fetchPoolAssets";
import { API_URL } from "@/libs/constants";
import generateGlobalProps from "@utils/generateGlobalProps";
import PoolProvider from "@providers/PoolProvider";
import { FC } from "react";
import {
	PoolForm,
	PoolActionsPair,
	PoolAssetsPair,
	PoolStats,
	PoolSettings,
	PoolProgress,
	MainPanel,
} from "@/libs/components";
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

export default Pool;
