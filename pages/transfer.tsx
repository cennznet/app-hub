import TransferProvider from "@/providers/TransferProvider";
import MainPanel from "@/components/MainPanel";
import { VFC } from "react";
import { NextSeo } from "next-seo";
import TransferForm from "@/components/TransferForm";
import TransferAssets from "@/components/TransferAssets";
import TransferProgress from "@/components/TransferProgress";
import { Api } from "@cennznet/api";
import { API_URL } from "@/constants";
import fetchCENNZAssets from "@/utils/fetchCENNZAssets";
import generateGlobalProps from "@/utils/generateGlobalProps";
import { CENNZAssets } from "@/types";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			supportedAssets: await fetchCENNZAssets(api),
			...(await generateGlobalProps("transfer")),
		},
	};
}

const Transfer: VFC<{ supportedAssets: CENNZAssets }> = ({
	supportedAssets,
}) => {
	return (
		<TransferProvider supportedAssets={supportedAssets}>
			<NextSeo title="CENNZnet Transfer" />
			<MainPanel defaultTitle="Transfer">
				<TransferForm>
					<TransferAssets />
				</TransferForm>
				<TransferProgress />
			</MainPanel>
		</TransferProvider>
	);
};

export default Transfer;
