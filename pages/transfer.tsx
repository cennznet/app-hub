import MainPanel from "@/components/MainPanel";
import { VFC } from "react";
import { NextSeo } from "next-seo";
import TransferForm from "@/components/TransferForm";
import TransferAssets from "@/components/TransferAssets";
import TransferProvider from "@/providers/TransferProvider";

const Transfer: VFC<{}> = ({}) => {
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
