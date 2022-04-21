import { Api } from "@cennznet/api";
import { BigNumber, ethers } from "ethers";
import { BridgedEthereumToken, HistoricalEventProof } from "@/types";
import {
	Balance,
	EthereumTransaction,
	getERC20PegContract,
	getBridgeContract,
} from "@/utils";
import { TransactionResponse } from "@ethersproject/abstract-provider";

export default async function sendHistoricalWithdrawEthereumRequest(
	api: Api,
	eventProof: HistoricalEventProof,
	transferAmount: Balance,
	transferAsset: BridgedEthereumToken,
	ethereumAddress: string,
	signer: ethers.Signer
): Promise<EthereumTransaction> {
	const bridgeContract = getBridgeContract<"OnBehalf">(signer);
	const pegContract = getERC20PegContract<"OnBehalf">(signer);
	const verificationFee: BigNumber = await bridgeContract.verificationFee();
	console.log("eventProof", eventProof);

	console.log(
		"sendHistoricalWithdrawEthereumRequest",
		transferAsset.address,
		transferAmount.toBigNumber(),
		ethereumAddress,
		eventProof,
		{ value: verificationFee }
	);
	const gasFee: BigNumber = await pegContract.estimateGas.withdraw(
		transferAsset.address,
		transferAmount.toBigNumber(),
		ethereumAddress,
		eventProof,
		{ value: verificationFee }
	);
	const tx = new EthereumTransaction();
	pegContract
		.withdraw(
			transferAsset.address,
			transferAmount.toBigNumber(),
			ethereumAddress,
			eventProof,
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
