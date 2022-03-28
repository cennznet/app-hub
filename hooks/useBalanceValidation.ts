import { Balance } from "@/utils";
import { MutableRefObject, useEffect, useRef } from "react";

interface BalanceValidationHook {
	inputRef: MutableRefObject<HTMLInputElement>;
}

export default function useBalanceValidation(
	currentValue: Balance,
	maxValue: Balance,
	historical?: boolean
): BalanceValidationHook {
	const inputRef = useRef<HTMLInputElement>();

	useEffect(() => {
		const input = inputRef.current;
		if (!input) return;
		if (!maxValue || historical) return input.setCustomValidity("");

		input.setCustomValidity(
			currentValue.gt(maxValue) ? "Insufficient fund" : ""
		);
	}, [currentValue, maxValue, historical]);

	return { inputRef };
}
