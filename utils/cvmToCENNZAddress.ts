import * as utils from "@polkadot/util";
import * as utilCrypto from "@polkadot/util-crypto";

export default function cvmToCENNZAddress(cvmAddress) {
	let message: Uint8Array = utils.stringToU8a("cvm:");
	message = utils.u8aConcat(
		message,
		new Array(7).fill(0),
		utils.hexToU8a(cvmAddress)
	);

	let checkSum: number = message.reduce((a, b) => a ^ b, 0);

	message = utils.u8aConcat(message, new Array(1).fill(checkSum));

	return utilCrypto.encodeAddress(message, 42);
}
