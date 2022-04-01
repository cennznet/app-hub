import { Api } from "@cennznet/api";
import { StakeAssets } from "@/types";
import fetchStakeAssets from "@/utils/fetchStakeAssets";
import { API_URL } from "@/constants";
import generateGlobalProps from "@/utils/generateGlobalProps";
import MainPanel from "@/components/MainPanel";
import StakeProvider from "@/providers/StakeProvider";
import { VFC } from "react";
import { css } from "@emotion/react";
import { NextSeo } from "next-seo";
import StakeForm from "@/components/StakeForm";
import StakeAmountInput from "@/components/StakeAmountInput";
import StakeActionsPair from "@/components/StakeActionsPair";
// import StakeElectedInfo from "@/components/StakeElectedInfo";
import StakeNominate from "@/components/StakeNominate";
import StakeOverview from "@/components/StakeOverview";
import StakeElected from "@/components/StakeElected";

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
			<div css={styles.root}>
				<NextSeo title="CENNZnet Staking" />
				<MainPanel defaultTitle="CENNZnet Staking">
					<StakeForm>
						<StakeActionsPair />
						<StakeAmountInput />
						<StakeNominate />
						{/*<StakeElectedInfo />*/}
					</StakeForm>
				</MainPanel>
				<MainPanel defaultTitle="Staking Overview">
					<StakeOverview>
						<StakeElected />
					</StakeOverview>
				</MainPanel>
			</div>
		</StakeProvider>
	);
};

export default Pool;

const styles = {
	root: css`
		margin: 1em auto;
		display: flex;
		width: 80%;
		justify-content: space-between;
	`,
};
