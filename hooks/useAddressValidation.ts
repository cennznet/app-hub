import { ChainOption } from "@/types";
import isCENNZAddress from "@/utils/isCENNZAddress";
import isEthereumAddress from "@/utils/isEthereumAddress";
import { MutableRefObject, useEffect, useRef } from "react";

interface AddressValidationHook {
	inputRef: MutableRefObject<HTMLInputElement>;
}

export default function useAddressValidation(
	address: string,
	addressType: ChainOption
): AddressValidationHook {
	const inputRef = useRef<HTMLInputElement>();

	useEffect(() => {
		const input = inputRef.current;
		if (!input) return;
		const isValid =
			addressType === "Ethereum"
				? isEthereumAddress(address)
				: isCENNZAddress(address);

		input.setCustomValidity(!isValid ? `Invalid ${addressType} address` : "");
	}, [addressType, address]);

	return { inputRef };
}
