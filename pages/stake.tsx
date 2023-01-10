import { Api } from "@cennznet/api";
import { StakeAssets } from "@/libs/types";
import fetchStakeAssets from "@/libs/utils/fetchStakeAssets";
import { CENNZ_NETWORK } from "@/libs/constants";
import MainPanel from "@/libs/components/MainPanel";
import StakeProvider from "@/libs/providers/StakeProvider";
import { VFC } from "react";
import { css } from "@emotion/react";
import { NextSeo } from "next-seo";
import StakeForm from "@/libs/components/StakeForm";
import StakeAmountInput from "@/libs/components/StakeAmountInput";
import StakeActionsPair from "@/libs/components/StakeActionsPair";
import StakeOverview from "@/libs/components/StakeOverview";
import StakeSummary from "@/libs/components/StakeSummary";
import StakeValidatorTable from "@/libs/components/StakeValidatorTable";
import StakeStashInput from "@/libs/components/StakeStashInput";

export async function getStaticProps() {
	const api = await Api.create({ provider: CENNZ_NETWORK.ApiUrl.InWebSocket });

	return {
		props: {
			stakeAssets: await fetchStakeAssets(api),
		},
	};
}

const Pool: VFC<{ stakeAssets: StakeAssets }> = ({ stakeAssets }) => {
	return (
		<StakeProvider stakeAssets={stakeAssets}>
			<div css={styles.root}>
				<NextSeo title="CENNZnet Staking" />
				<MainPanel defaultTitle="Staking">
					<StakeForm>
						<StakeActionsPair />
						<StakeStashInput />
						<StakeAmountInput />
					</StakeForm>
				</MainPanel>
				<MainPanel defaultTitle="Overview" css={styles.overview}>
					<StakeOverview>
						<StakeSummary />
						<StakeValidatorTable />
					</StakeOverview>
				</MainPanel>
			</div>
		</StakeProvider>
	);
};

export default Pool;

const styles = {
	root: css`
		display: flex;
		justify-content: space-between;
	`,
	overview: css`
		width: fit-content;
	`,
};
