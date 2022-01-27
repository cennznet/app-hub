import React, { useEffect, useState } from "react";
import Connect from "./connect";
import Emery from "./emery";
import { chains, chainIds } from "../../utils/networks";
import BlockchainProvider from "../../providers/BlockchainProvider";
import { useWallet } from "../../providers/SupportedWalletProvider";
const Home: React.FC<{}> = () => {
	const [bridgeState, setBridgeState] = useState("");
	const { selectedAccount } = useWallet();

	useEffect(() => {
		(async () => {
			const CENNZnetNetwork = window.localStorage.getItem("CENNZnet-network")
				? window.localStorage.getItem("CENNZnet-network")
				: "Azalea";
			const ethereumNetwork = window.localStorage.getItem("ethereum-network");
			const { ethereum }: any = window;
			const ethChainId = await ethereum.request({ method: "eth_chainId" });

			ethereumNetwork === chains[CENNZnetNetwork] &&
			ethChainId === chainIds[CENNZnetNetwork] &&
			selectedAccount
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
