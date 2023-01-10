import { ethers } from "ethers";
import { ETHEREUM_NETWORK } from "@/libs/constants";
import CENNZnetBridge from "@/libs/artifacts/CENNZnetBridge.json";

type ContractType = "ReadOnly" | "OnBehalf";

type ContractSigner<T> = T extends "ReadOnly"
	? ethers.providers.Web3Provider
	: T extends "OnBehalf"
	? ethers.Signer
	: never;

export default function getBridgeContract<T extends ContractType>(
	signer: ContractSigner<T>
): ethers.Contract {
	const address = ETHEREUM_NETWORK.BridgeAddress;

	return new ethers.Contract(address, CENNZnetBridge, signer);
}
