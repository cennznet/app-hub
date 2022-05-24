import { BridgedEthereumToken, EthereumToken } from "@/libs/types";
import {
	Balance,
	getERC20TokenContract,
	getERC20PegContract,
	EthereumTransaction,
} from "@utils";
import { ethers } from "ethers";
import { ETH_TOKEN_ADDRESS } from "@/libs/constants";
import { decodeAddress } from "@polkadot/keyring";
import { TransactionResponse } from "@ethersproject/abstract-provider";

export default async function sendDepositRequest(
	transferAmount: Balance,
	transferToken: EthereumToken | BridgedEthereumToken,
	cennzAddress: string,
	signer: ethers.Signer
): Promise<EthereumTransaction> {
	const pegContract = getERC20PegContract<"OnBehalf">(signer);
	const decodedAddress = decodeAddress(cennzAddress);
	const transferValue = transferAmount.toBigNumber();
	const isERC20Contract = transferToken.address !== ETH_TOKEN_ADDRESS;
	const tx = new EthereumTransaction();
	const requestContractApproval = async () => {
		if (!isERC20Contract) return Promise.resolve();

		const tokenContract = getERC20TokenContract<"OnBehalf">(
			transferToken,
			signer
		);

		const approveTx: TransactionResponse = await tokenContract.approve(
			pegContract.address,
			transferValue
		);

		return await approveTx.wait();
	};

	await requestContractApproval();

	pegContract
		.deposit(
			transferToken.address,
			transferValue,
			decodedAddress,
			isERC20Contract
				? null
				: {
						value: transferValue,
				  }
		)
		.then((pegTx: TransactionResponse) => {
			tx.setHash(pegTx.hash);
			return pegTx.wait(2);
		})
		.then(() => {
			tx.setSuccess();
		})
		.catch((error) => {
			if (error?.code === 4001) {
				tx.setCancel();
				return;
			}
			tx.setFailure(error?.code);
		});

	return tx;
}
