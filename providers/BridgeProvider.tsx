import React, { createContext, useContext, ReactNode, useState } from "react";
import { ethers } from "ethers";
import CENNZnetBridge from "@/artifacts/CENNZnetBridge.json";
import ERC20Peg from "@/artifacts/ERC20Peg.json";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

type bridgeContextType = {
	Contracts: object;
	Account: string;
	initBridge: Function;
};

const bridgeContextDefaultValues: bridgeContextType = {
	Contracts: null,
	Account: null,
	initBridge: null,
};

const BridgeContext = createContext<bridgeContextType>(
	bridgeContextDefaultValues
);

export function useBridge() {
	return useContext(BridgeContext);
}

type Props = {
	children?: ReactNode;
};

const BridgeProvider: React.FC<React.PropsWithChildren<{}>> = ({
	children,
}: Props) => {
	const [value, setValue] = useState({
		Contracts: {
			bridge: {} as ethers.Contract,
			peg: {} as ethers.Contract,
		},
		Account: "",
		Signer: {} as ethers.providers.JsonRpcSigner,
	});

	const initBridge = (ethereum: any, accounts: string[]) => {
		return new Promise(async (resolve, reject) => {
			try {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				let BridgeAddress: string, ERC20PegAddress: string;

				switch (ETH_CHAIN_ID) {
					default:
					case "1":
						BridgeAddress = "0x369e2285CCf43483e76746cebbf3d1d6060913EC";
						ERC20PegAddress = "0x8F68fe02884b2B05e056aF72E4F2D2313E9900eC";
						break;
					case "42":
						BridgeAddress = "0x9AFe4E42d8ab681d402e8548Ee860635BaA952C5";
						ERC20PegAddress = "0x5Ff2f9582FcA1e11d47e4e623BEf4594EB12b30d";
						break;
				}

				const bridge: ethers.Contract = new ethers.Contract(
					BridgeAddress,
					CENNZnetBridge,
					signer
				);

				const peg: ethers.Contract = new ethers.Contract(
					ERC20PegAddress,
					ERC20Peg,
					signer
				);

				setValue({
					Contracts: {
						bridge,
						peg,
					},
					Account: accounts[0],
					Signer: signer,
				});

				resolve({ bridge, peg, accounts, signer });
			} catch (err) {
				reject(err);
			}
		});
	};

	return (
		<>
			<BridgeContext.Provider value={{ ...value, initBridge }}>
				{children}
			</BridgeContext.Provider>
		</>
	);
};

export default BridgeProvider;
