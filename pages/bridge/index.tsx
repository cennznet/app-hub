import React, { useEffect, useState } from "react";
import Connect from "./connect";
import Emery from "./emery";
import BlockchainProvider from "../../providers/BlockchainProvider";

const Home: React.FC<{}> = () => {
	const [bridgeState, setBridgeState] = useState("");

	useEffect(() => {
		const ethereumNetwork = window.localStorage.getItem("ethereum-network");
		ethereumNetwork ? setBridgeState("emery") : setBridgeState("connect");
	}, []);

	return (
		<BlockchainProvider>
			{bridgeState === "emery" && <Emery />}
			{bridgeState === "connect" && <Connect setBridgeState={setBridgeState} />}
		</BlockchainProvider>
	);
};

export default Home;
