import { ethers } from "ethers";
import { ETH_CHAIN_ID } from "@/constants";
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
		ETH_CHAIN_ID === 1
			? "0x76BAc85e1E82cd677faa2b3f00C4a2626C4c6E32"
			: "0xa39E871e6e24f2d1Dd6AdA830538aBBE7b30F78F";

	return new ethers.Contract(address, ERC20Peg, signer);
}
