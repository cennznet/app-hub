import React, { useEffect, useState } from "react";
import Connect from "./connect";
import Emery from "./emery";
import CENNZApiProvider from "../../providers/CENNZApiProvider";
import SupportedWalletProvider from "../../providers/SupportedWalletProvider";
import DappModuleProvider from "../../providers/DappModuleProvider";
import Web3AccountsProvider from "../../providers/Web3AccountsProvider";
import BlockchainProvider from "../../providers/BlockchainProvider";

const Home: React.FC<{}> = () => {
  const [bridgeState, setBridgeState] = useState("");

  useEffect(() => {
    const ethereumNetwork = window.localStorage.getItem("ethereum-network");
    ethereumNetwork ? setBridgeState("emery") : setBridgeState("connect");
  }, []);

  return (
    <CENNZApiProvider>
      <DappModuleProvider>
        <Web3AccountsProvider>
          <BlockchainProvider>
            <SupportedWalletProvider>
              {bridgeState === "emery" && <Emery />}
              {bridgeState === "connect" && (
                <Connect setBridgeState={setBridgeState} />
              )}
            </SupportedWalletProvider>
          </BlockchainProvider>
        </Web3AccountsProvider>
      </DappModuleProvider>
    </CENNZApiProvider>
  );
};

export default Home;
