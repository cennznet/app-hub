import { ethers } from "ethers";
import {
	ETH_CHAIN_ID,
	MAINNET_BRIDGE_CONTRACT,
	KOVAN_BRIDGE_CONTRACT,
} from "@/libs/constants";
import CENNZnetBridge from "@artifacts/CENNZnetBridge.json";

type ContractType = "ReadOnly" | "OnBehalf";

type ContractSigner<T> = T extends "ReadOnly"
	? ethers.providers.Web3Provider
	: T extends "OnBehalf"
	? ethers.Signer
	: never;

export default function getBridgeContract<T extends ContractType>(
	signer: ContractSigner<T>
): ethers.Contract {
	const address =
		ETH_CHAIN_ID === 1 ? MAINNET_BRIDGE_CONTRACT : KOVAN_BRIDGE_CONTRACT;

	return new ethers.Contract(address, CENNZnetBridge, signer);
}
