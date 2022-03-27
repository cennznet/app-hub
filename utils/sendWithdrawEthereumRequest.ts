import { BridgedEthereumToken } from "@/types";
import { Balance, getBridgeContract } from "@/utils";
import getERC20PegContract from "@/utils/getERC20PegContract";
import { Api } from "@cennznet/api";
import { EthEventProof } from "@cennznet/api/derives/ethBridge/types";
import { BigNumber, ethers } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";

export default async function sendWithdrawEthereumRequest(
	api: Api,
	eventProof: EthEventProof,
	transferAmount: Balance,
	transferAsset: BridgedEthereumToken,
	ethereumAddress: string,
	signer: ethers.Signer,
	blockHash?: string
): Promise<TransactionResponse | "cancelled"> {
	let notaryKeys: string[];
	if (!!blockHash) {
		notaryKeys = (
			await api.query.ethBridge.notaryKeys.at(blockHash)
		).toJSON() as string[];
	} else {
		notaryKeys = (await api.query.ethBridge.notaryKeys()).toJSON() as string[];
	}

	const validators = notaryKeys.map((validator) => {
		if (
			validator ===
			"0x000000000000000000000000000000000000000000000000000000000000000000"
		)
			return ethers.constants.AddressZero;

		return ethers.utils.computeAddress(validator);
	});

	const bridgeContract = getBridgeContract<"OnBehalf">(signer);
	const pegContract = getERC20PegContract<"OnBehalf">(signer);
	const verificationFee: BigNumber = await bridgeContract.verificationFee();
	const gasFee: BigNumber = await pegContract.estimateGas.withdraw(
		transferAsset.address,
		transferAmount.toBigNumber(),
		ethereumAddress,
		{ ...eventProof, validators },
		{ value: verificationFee }
	);

	try {
		const tx: TransactionResponse = await pegContract.withdraw(
			transferAsset.address,
			transferAmount.toBigNumber(),
			ethereumAddress,
			{ ...eventProof, validators },
			{ value: verificationFee, gasLimit: (gasFee.toNumber() * 1.02).toFixed() }
		);

		await tx.wait();
		return tx;
	} catch (error) {
		if (error?.code === 4001) return "cancelled";
		throw error;
	}
}
