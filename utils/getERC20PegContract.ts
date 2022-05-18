import { ethers } from "ethers";
import {
	ETH_CHAIN_ID,
	MAINNET_PEG_CONTRACT,
	ROPSTEN_PEG_CONTRACT,
} from "@/constants";
import ERC20Peg from "@/artifacts/ERC20Peg.json";

type ContractType = "ReadOnly" | "OnBehalf";

type ContractSigner<T> = T extends "ReadOnly"
	? ethers.providers.Web3Provider
	: T extends "OnBehalf"
	? ethers.Signer
	: never;

export default function getERC20PegContract<T extends ContractType>(
	signer: ContractSigner<T>
): ethers.Contract {
	const address =
		ETH_CHAIN_ID === 1 ? MAINNET_PEG_CONTRACT : ROPSTEN_PEG_CONTRACT;

	return new ethers.Contract(address, ERC20Peg, signer);
}
