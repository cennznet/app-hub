import { Api } from "@cennznet/api";
import { FC } from "react";
import { API_URL } from "@/libs/constants";
import { fetchBridgeTokens } from "@/libs/utils";
import { BridgedEthereumToken, EthereumToken } from "@/libs/types";
import { NextSeo } from "next-seo";
import BridgeProvider from "@/libs/providers/BridgeProvider";
import {
	BridgeActionsPair,
	BridgeForm,
	BridgeProgress,
	BridgeStats,
	BridgeTokenDestination,
	MainPanel,
} from "@/libs/components";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			depositTokens: await fetchBridgeTokens<"Deposit">(api, "Deposit"),
			withdrawTokens: await fetchBridgeTokens<"Withdraw">(api, "Withdraw"),
		},
	};
}

interface BridgeProps {
	depositTokens: EthereumToken[];
	withdrawTokens: BridgedEthereumToken[];
}

const Bridge: FC<BridgeProps> = ({ depositTokens, withdrawTokens }) => {
	return (
		<BridgeProvider
			depositTokens={depositTokens}
			withdrawTokens={withdrawTokens}
		>
			<NextSeo title="Emery Bridge" />
			<MainPanel defaultTitle="Emery Bridge">
				<BridgeForm>
					<BridgeActionsPair />
					<BridgeTokenDestination />
					<BridgeStats />
				</BridgeForm>
				<BridgeProgress />
			</MainPanel>
		</BridgeProvider>
	);
};

export default Bridge;
