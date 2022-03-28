import { MutableRefObject, useEffect, useRef } from "react";
import isCENNZAddress from "@/utils/isCENNZAddress";

interface BlockHashValidationHook {
	inputRef: MutableRefObject<HTMLInputElement | HTMLTextAreaElement>;
}

export default function useBlockHashValidation(
	hash: string,
	expanded: boolean
): BlockHashValidationHook {
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>();

	useEffect(() => {
		const input = inputRef.current;
		if (!input) return;
		if (!expanded) return input.setCustomValidity("");
		const isValid = isCENNZAddress(hash);

		input.setCustomValidity(!isValid ? `Invalid block hash` : "");
	}, [hash, expanded]);

	return { inputRef };
}
