import React, { useEffect, useState } from "react";
import Connect from "./connect";
import Emery from "./emery";
import BlockchainProvider from "../../providers/BlockchainProvider";
import { useWallet } from "../../providers/SupportedWalletProvider";
import { useCENNZApi } from "../../providers/CENNZApiProvider";

const Home: React.FC<{}> = () => {
	const [bridgeState, setBridgeState] = useState("");
	const { selectedAccount } = useWallet();
	const { api, initApi } = useCENNZApi();

	useEffect(() => {
		if (!api?.isConnected) {
			initApi();
		}
	}, [api, initApi]);

	useEffect(() => {
		(async () => {
			const { ethereum }: any = window;
			const ethChainId = await ethereum.request({ method: "eth_chainId" });
			const CENNZnetAccount = window.localStorage.getItem("CENNZnet-account");

			ethChainId === "0x1" && CENNZnetAccount
				? setBridgeState("emery")
				: setBridgeState("connect");
		})();
	}, [selectedAccount]);

	return (
		<BlockchainProvider>
			{bridgeState === "emery" && <Emery />}
			{bridgeState === "connect" && <Connect setBridgeState={setBridgeState} />}
		</BlockchainProvider>
	);
};

export default Home;
