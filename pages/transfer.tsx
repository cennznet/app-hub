import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchSwapAssets from "@/utils/fetchSwapAssets";
import { API_URL } from "@/constants";
import generateGlobalProps from "@/utils/generateGlobalProps";
import TransferProvider from "@/providers/TransferProvider";
import MainPanel from "@/components/MainPanel";
import { VFC } from "react";
import { NextSeo } from "next-seo";
import TransferForm from "@/components/TransferForm";
import TransferAssets from "@/components/TransferAssets";

const Transfer: VFC = () => {
	return (
		<TransferProvider>
			<NextSeo title="CENNZnet Transfer" />
			<MainPanel defaultTitle="Transfer">
				<TransferForm>
					<TransferAssets />
				</TransferForm>
			</MainPanel>
		</TransferProvider>
	);
};

export default Transfer;
