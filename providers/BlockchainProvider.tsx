import React, { createContext, useContext, ReactNode, useState } from "react";
import { ethers } from "ethers";
import CENNZnetBridge from "../artifacts/CENNZnetBridge.json";
import ERC20Peg from "../artifacts/ERC20Peg.json";

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
				const BridgeAddress = "0x369e2285CCf43483e76746cebbf3d1d6060913EC";
				const ERC20PegAddress = "0x8F68fe02884b2B05e056aF72E4F2D2313E9900eC";

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
