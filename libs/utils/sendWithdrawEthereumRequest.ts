import { BridgedEthereumToken, HistoricalEventProof } from "@/libs/types";
import {
	Balance,
	EthereumTransaction,
	getERC20PegContract,
	getBridgeContract,
} from "@/libs/utils";
import { Api } from "@cennznet/api";
import { EthEventProof } from "@cennznet/api/derives/ethBridge/types";
import { BigNumber, ethers } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";

export default async function sendWithdrawEthereumRequest(
	api: Api,
	eventProof: EthEventProof | HistoricalEventProof,
	transferAmount: Balance,
	transferAsset: BridgedEthereumToken,
	ethereumAddress: string,
	signer: ethers.Signer
): Promise<EthereumTransaction> {
	let validators: string[];
	if (!eventProof.validators) {
		const notaryKeys = (
			await api.query.ethBridge.notaryKeys()
		).toJSON() as string[];

		validators = notaryKeys.map((validator) => {
			if (
				validator ===
				"0x000000000000000000000000000000000000000000000000000000000000000000"
			)
				return ethers.constants.AddressZero;

			return ethers.utils.computeAddress(validator);
		});
	}

	const bridgeContract = getBridgeContract<"OnBehalf">(signer);
	const pegContract = getERC20PegContract<"OnBehalf">(signer);
	const verificationFee: BigNumber = await bridgeContract.verificationFee();
	const gasFee: BigNumber = await pegContract.estimateGas.withdraw(
		transferAsset.address,
		transferAmount.toBigNumber(),
		ethereumAddress,
		{ ...eventProof, validators: eventProof.validators ?? validators },
		{ value: verificationFee }
	);
	const tx = new EthereumTransaction();
	pegContract
		.withdraw(
			transferAsset.address,
			transferAmount.toBigNumber(),
			ethereumAddress,
			{ ...eventProof, validators: eventProof.validators ?? validators },
			{ value: verificationFee, gasLimit: (gasFee.toNumber() * 1.02).toFixed() }
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
