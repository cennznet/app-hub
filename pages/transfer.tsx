import TransferProvider from "@/providers/TransferProvider";
import MainPanel from "@/components/MainPanel";
import { VFC } from "react";
import { NextSeo } from "next-seo";
import TransferForm from "@/components/TransferForm";
import TransferAssets from "@/components/TransferAssets";
import TransferProgress from "@/components/TransferProgress";

const Transfer: VFC = () => {
	return (
		<TransferProvider>
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
