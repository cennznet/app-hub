import { ethers } from "ethers";
import { ETH_CHAIN_ID } from "@/constants";
import CENNZnetBridge from "@/artifacts/CENNZnetBridge.json";

type ContractType = "ReadOnly" | "OnBehalf";

type ContractSigner<T> = T extends "ReadOnly"
	? ethers.providers.Web3Provider
	: T extends "OnBehalf"
	? ethers.Signer
	: never;

// TODO: Needs test
export default function getBridgeContract<T extends ContractType>(
	signer: ContractSigner<T>
): ethers.Contract {
	const address =
		ETH_CHAIN_ID === 1
			? "0xf7997B93437d5d2AC226f362EBF0573ce7a53930"
			: "0x6484A31Df401792c784cD93aAAb3E933B406DdB3";

	return new ethers.Contract(address, CENNZnetBridge, signer);
}
