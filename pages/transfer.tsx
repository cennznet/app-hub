import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchSwapAssets from "@/utils/fetchSwapAssets";
import { API_URL } from "@/constants";
import generateGlobalProps from "@/utils/generateGlobalProps";
import SwapProvider from "@/providers/SwapProvider";
import MainPanel from "@/components/MainPanel";
import { VFC } from "react";
import { NextSeo } from "next-seo";
import TransferForm from "@/components/TransferForm";
import TransferAssets from "@/components/TransferAssets";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			supportedAssets: await fetchSwapAssets(api),
			...(await generateGlobalProps("transfer")),
		},
	};
}

const Transfer: VFC<{ supportedAssets: CENNZAsset[] }> = ({
	supportedAssets,
}) => {
	return (
		<SwapProvider supportedAssets={supportedAssets}>
			<NextSeo title="CENNZnet Transfer" />
			<MainPanel defaultTitle="Transfer">
				<TransferForm>
					<TransferAssets />
				</TransferForm>
			</MainPanel>
		</SwapProvider>
	);
};

export default Transfer;
