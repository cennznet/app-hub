import { Api } from "@cennznet/api";
import { VFC } from "react";
import { API_URL } from "@/constants";
import BridgeActionsPair from "@/components/BridgeActionsPair";
import BridgeForm from "@/components/BridgeForm";
import BridgeStats from "@/components/BridgeStats";
import BridgeTokenDestination from "@/components/BridgeTokenDestination";
import MainPanel from "@/components/MainPanel";
import BridgeProvider from "@/providers/BridgeProvider";
import { fetchBridgeTokens } from "@/utils";
import { BridgedEthereumToken, EthereumToken } from "@/types";

export async function getStaticProps() {
	const api = await Api.create({ provider: API_URL });

	return {
		props: {
			depositTokens: await fetchBridgeTokens<"Deposit">(api, "Deposit"),
			withdrawTokens: await fetchBridgeTokens<"Withdraw">(api, "Withdraw"),
		},
	};
}

const Bridge: VFC<{
	depositTokens: EthereumToken[];
	withdrawTokens: BridgedEthereumToken[];
}> = ({ depositTokens, withdrawTokens }) => {
	return (
		<BridgeProvider
			depositTokens={depositTokens}
			withdrawTokens={withdrawTokens}
		>
			<MainPanel defaultTitle="Bridge">
				<BridgeForm>
					<BridgeActionsPair />
					<BridgeTokenDestination />
					<BridgeStats />
				</BridgeForm>
			</MainPanel>
		</BridgeProvider>
	);
};

export default Bridge;
