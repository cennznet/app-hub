import { BridgedEthereumToken, EthereumToken } from "@/types";
import { Balance, getERC20TokenContract } from "@/utils";
import { ethers } from "ethers";
import { ETH_TOKEN_ADDRESS } from "@/constants";
import { decodeAddress } from "@polkadot/keyring";
import getERC20PegContract from "@/utils/getERC20PegContract";

export default async function sendDepositRequest(
	transferAmount: Balance,
	transferToken: EthereumToken | BridgedEthereumToken,
	cennzAddress: string,
	signer: ethers.Signer
): Promise<ethers.Transaction | "cancelled"> {
	const pegContract = getERC20PegContract<"OnBehalf">(signer);
	const decodedAddress = decodeAddress(cennzAddress);
	const transferValue = transferAmount.toBigNumber();

	try {
		if (transferToken.address === ETH_TOKEN_ADDRESS) {
			const tx = await pegContract.deposit(
				transferToken.address,
				transferValue,
				decodedAddress,
				{
					value: transferValue,
				}
			);

			await tx.wait();
			return tx;
		}

		const tokenContract = getERC20TokenContract<"OnBehalf">(
			transferToken,
			signer
		);

		const approveTx = await tokenContract.approve(
			pegContract.address,
			transferValue
		);

		await approveTx.wait();

		const tx = await pegContract.deposit(
			transferToken.address,
			transferValue,
			decodedAddress
		);
		await tx.wait();

		return tx;
	} catch (error) {
		if (error?.code === 4001) return "cancelled";
		throw error;
	}
}
