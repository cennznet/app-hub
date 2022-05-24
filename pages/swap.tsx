import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/libs/types";
import fetchSwapAssets from "@utils/fetchSwapAssets";
import { API_URL } from "@/libs/constants";
import generateGlobalProps from "@utils/generateGlobalProps";
import SwapProvider from "@providers/SwapProvider";
import {
	SwapForm,
	SwapAssetsPair,
	SwapStats,
	SwapSettings,
	SwapProgress,
	MainPanel,
} from "@components";
import { memo, FC } from "react";
import { NextSeo } from "next-seo";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			supportedAssets: await fetchSwapAssets(api),
			...(await generateGlobalProps("swap")),
		},
	};
}

interface SwapProps {
	supportedAssets: CENNZAsset[];
}

const Swap: FC<SwapProps> = ({ supportedAssets }) => {
	return (
		<SwapProvider supportedAssets={supportedAssets}>
			<NextSeo title="CENNZX Exchange" />
			<MainPanel defaultTitle="CENNZX Exchange">
				<SwapForm>
					<SwapAssetsPair />
					<SwapStats />
					<SwapSettings />
				</SwapForm>
				<SwapProgress />
			</MainPanel>
		</SwapProvider>
	);
};

export default memo(Swap);
