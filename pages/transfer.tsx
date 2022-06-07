import TransferProvider from "@/libs/providers/TransferProvider";
import { FC } from "react";
import { NextSeo } from "next-seo";
import {
	MainPanel,
	TransferForm,
	TransferAssets,
	TransferProgress,
} from "@/libs/components";
import { Api } from "@cennznet/api";
import { API_URL } from "@/libs/constants";

import { fetchCENNZAssets, generateGlobalProps } from "@/libs/utils";
import { CENNZAssets } from "@/libs/types";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			supportedAssets: await fetchCENNZAssets(api),
			...(await generateGlobalProps("transfer")),
		},
	};
}

const Transfer: FC<{ supportedAssets: CENNZAssets }> = ({
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
