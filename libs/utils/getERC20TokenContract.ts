import { EthereumToken } from "@/libs/types";
import { ethers } from "ethers";
import GenericERC20Token from "@artifacts/GenericERC20Token.json";

type ContractType = "ReadOnly" | "OnBehalf";

type ContractSigner<T> = T extends "ReadOnly"
	? ethers.providers.Web3Provider
	: T extends "OnBehalf"
	? ethers.Signer
	: never;

export default function getERC20TokenContract<T extends ContractType>(
	token: EthereumToken,
	signer: ContractSigner<T>
): ethers.Contract {
	return new ethers.Contract(token.address, GenericERC20Token, signer);
}
