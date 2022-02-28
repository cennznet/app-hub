import React, { createContext, useContext, ReactNode, useState } from "react";
import { ethers } from "ethers";
import CENNZnetBridge from "@/artifacts/CENNZnetBridge.json";
import ERC20Peg from "@/artifacts/ERC20Peg.json";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

type blockchainContextType = {
	Contracts: object;
	Account: string;
	initBlockchain: Function;
};

const blockchainContextDefaultValues: blockchainContextType = {
	Contracts: null,
	Account: null,
	initBlockchain: null,
};

const BlockchainContext = createContext<blockchainContextType>(
	blockchainContextDefaultValues
);

export function useBlockchain() {
	return useContext(BlockchainContext);
}

type Props = {
	children?: ReactNode;
};

const BlockchainProvider: React.FC<React.PropsWithChildren<{}>> = ({
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

	const initBlockchain = (ethereum: any, accounts: string[]) => {
		return new Promise(async (resolve, reject) => {
			try {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner();
				let BridgeAddress: string, ERC20PegAddress: string;

				switch (ETH_CHAIN_ID) {
					default:
					case "1":
						BridgeAddress = "0xf7997B93437d5d2AC226f362EBF0573ce7a53930";
						ERC20PegAddress = "0x76BAc85e1E82cd677faa2b3f00C4a2626C4c6E32";
						break;
					case "42":
						BridgeAddress = "0x6484A31Df401792c784cD93aAAb3E933B406DdB3";
						ERC20PegAddress = "0xa39E871e6e24f2d1Dd6AdA830538aBBE7b30F78F";
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
			<BlockchainContext.Provider value={{ ...value, initBlockchain }}>
				{children}
			</BlockchainContext.Provider>
		</>
	);
};

export default BlockchainProvider;
