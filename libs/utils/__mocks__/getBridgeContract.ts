import { ROPSTEN_BRIDGE_CONTRACT } from "@/libs/constants";
import { BigNumber } from "ethers";

export default function getERC20PegContract<T>(_signer) {
	return {
		address: ROPSTEN_BRIDGE_CONTRACT,
		verificationFee: jest.fn(() => Promise.resolve(BigNumber.from(1))),
	};
}
