import BridgeActionsPair from "@/components/BridgeActionsPair";
import BridgeForm from "@/components/BridgeForm";
import BridgeStats from "@/components/BridgeStats";
import BridgeTokenDestination from "@/components/BridgeTokenDestination";
import MainPanel from "@/components/MainPanel";
import BridgeProvider from "@/providers/BridgeProvider";
import { VFC } from "react";

const Bridge: VFC<{}> = ({}) => {
	return (
		<BridgeProvider>
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
