import { ETHEREUM_NETWORK } from "@/libs/constants";
import { BigNumber } from "ethers";

export default function getBridgeContract<T>(_signer) {
	return {
		address: ETHEREUM_NETWORK.BridgeAddress,
		verificationFee: jest.fn(() => Promise.resolve(BigNumber.from(1))),
	};
}
