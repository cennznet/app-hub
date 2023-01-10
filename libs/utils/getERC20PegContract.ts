import { ethers } from "ethers";
import { ETHEREUM_NETWORK } from "@/libs/constants";
import ERC20Peg from "@/libs/artifacts/ERC20Peg.json";

type ContractType = "ReadOnly" | "OnBehalf";

type ContractSigner<T> = T extends "ReadOnly"
	? ethers.providers.Web3Provider
	: T extends "OnBehalf"
	? ethers.Signer
	: never;

export default function getERC20PegContract<T extends ContractType>(
	signer: ContractSigner<T>
): ethers.Contract {
	const address = ETHEREUM_NETWORK.PegAddress;

	return new ethers.Contract(address, ERC20Peg, signer);
}
