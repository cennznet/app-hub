import { ethers } from "ethers";

export default function isEthereumAddress(address: string): boolean {
	return ethers.utils.isAddress(address);
}
