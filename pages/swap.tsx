import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/libs/types";
import fetchSwapAssets from "@/libs/utils/fetchSwapAssets";
import { CENNZ_NETWORK } from "@/libs/constants";
import generateGlobalProps from "@/libs/utils/generateGlobalProps";
import SwapProvider from "@/libs/providers/SwapProvider";
import {
	SwapForm,
	SwapAssetsPair,
	SwapStats,
	SwapSettings,
	SwapProgress,
	MainPanel,
} from "@/libs/components";
import { FC } from "react";
import { NextSeo } from "next-seo";

export async function getStaticProps() {
	const api = await Api.create({ provider: CENNZ_NETWORK.ApiUrl.InWebSocket });

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

export default Swap;
