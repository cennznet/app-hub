import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchSwapAssets from "@/utils/fetchSwapAssets";
import { API_URL } from "@/constants";
import generateGlobalProps from "@/utils/generateGlobalProps";
import SwapProvider from "@/providers/SwapProvider";
import SwapForm from "@/components/SwapForm";
import SwapAssetsPair from "@/components/SwapAssetsPair";
import SwapStats from "@/components/SwapStats";
import SwapSettings from "@/components/SwapSettings";
import SwapProgress from "@/components/SwapProgress";
import MainPanel from "@/components/MainPanel";
import { VFC } from "react";
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

const Swap: VFC<{ supportedAssets: CENNZAsset[] }> = ({ supportedAssets }) => {
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
