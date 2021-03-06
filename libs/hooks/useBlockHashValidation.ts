import { MutableRefObject, useEffect, useRef } from "react";
import { isCENNZAddress } from "@/libs/utils";

interface BlockHashValidationHook {
	inputRef: MutableRefObject<HTMLInputElement | HTMLTextAreaElement>;
}

export default function useBlockHashValidation(
	hash: string,
	disabled?: boolean
): BlockHashValidationHook {
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>();

	useEffect(() => {
		const input = inputRef.current;
		if (!input) return;
		if (disabled) return input.setCustomValidity("");
		const isValid = isCENNZAddress(hash);

		input.setCustomValidity(!isValid ? `Invalid block hash` : "");
	}, [hash, disabled]);

	return { inputRef };
}
