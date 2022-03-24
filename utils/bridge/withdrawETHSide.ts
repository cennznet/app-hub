import { utils, constants, BytesLike, Contract } from "ethers";
import { Api } from "@cennznet/api";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import { EthEventProof } from "@cennznet/api/derives/ethBridge/types";

export default async function withdrawETHSide(
	withdrawAmount: string,
	eventProof: EthEventProof,
	ethAddress: string,
	tokenAddress: string,
	api: Api,
	bridgeContract: Contract,
	pegContract: Contract,
	blockHash?: string
): Promise<TransactionResponse> {
	const verificationFee = bridgeContract.verificationFee();
	let notaryKeys;
	if (!!blockHash) {
		notaryKeys = await api.query.ethBridge.notaryKeys.at(blockHash);
	} else {
		notaryKeys = await api.query.ethBridge.notaryKeys();
	}

	const validators = notaryKeys.map((validator: BytesLike) => {
		// session key is not set
		if (
			utils.hexlify(validator) ===
			utils.hexlify(
				"0x000000000000000000000000000000000000000000000000000000000000000000"
			)
		) {
			return constants.AddressZero;
		}
		return utils.computeAddress(validator);
	});

	let gasEstimate = await pegContract.estimateGas.withdraw(
		tokenAddress,
		withdrawAmount,
		ethAddress,
		{
			eventId: eventProof.eventId,
			validatorSetId: eventProof.validatorSetId,
			v: eventProof.v,
			r: eventProof.r,
			s: eventProof.s,
			validators,
		},
		{
			value: verificationFee,
		}
	);

	let gasLimit = (gasEstimate.toNumber() * 1.02).toFixed(0);

	return await pegContract.withdraw(
		tokenAddress,
		withdrawAmount,
		ethAddress,
		{
			eventId: eventProof.eventId,
			validatorSetId: eventProof.validatorSetId,
			v: eventProof.v,
			r: eventProof.r,
			s: eventProof.s,
			validators,
		},
		{
			value: verificationFee,
			gasLimit: gasLimit,
		}
	);
}
