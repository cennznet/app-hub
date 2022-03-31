import { Api } from "@cennznet/api";
import { StakeAssets } from "@/types";
import fetchStakeAssets from "@/utils/fetchStakeAssets";
import { API_URL } from "@/constants";
import generateGlobalProps from "@/utils/generateGlobalProps";
import MainPanel from "@/components/MainPanel";
import StakeProvider from "@/providers/StakeProvider";
import { VFC } from "react";
import { NextSeo } from "next-seo";
import StakeForm from "@/components/StakeForm";
import StakeAmountInput from "@/components/StakeAmountInput";
import StakeActionsPair from "@/components/StakeActionsPair";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			stakeAssets: await fetchStakeAssets(api),
			...(await generateGlobalProps("stake")),
		},
	};
}

const Pool: VFC<{ stakeAssets: StakeAssets }> = ({ stakeAssets }) => {
	return (
		<StakeProvider stakeAssets={stakeAssets}>
			<NextSeo title="CENNZX Staking" />
			<MainPanel defaultTitle="CENNZX Staking">
				<StakeForm>
					<StakeActionsPair />
					<StakeAmountInput />
				</StakeForm>
			</MainPanel>
		</StakeProvider>
	);
};

export default Pool;
