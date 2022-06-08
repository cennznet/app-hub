import { ROPSTEN_PEG_CONTRACT } from "@/libs/constants";
import { BigNumber } from "ethers";

const transaction = jest.fn(
	async (_tokenAddress, transferAmount, _cennzAddress, _value?) => {
		if (transferAmount.toNumber() === 0) throw { code: 4001 };
		if (transferAmount.toNumber() === 5) throw { code: 4000 };

		return {
			hash: "0x000000000000000",
			wait: (confirmations) => Promise.resolve(confirmations),
		};
	}
);

export default function getERC20PegContract<T>(_signer) {
	return {
		address: ROPSTEN_PEG_CONTRACT,
		deposit: transaction,
		withdraw: transaction,
		estimateGas: {
			withdraw: jest.fn(() => Promise.resolve(BigNumber.from(1))),
		},
	};
}
