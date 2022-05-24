import { Balance } from "@utils";
import { MutableRefObject, useEffect, useRef } from "react";

interface BalanceValidationHook {
	inputRef: MutableRefObject<HTMLInputElement>;
}

export default function useBalanceValidation(
	currentValue: Balance,
	maxValue: Balance,
	disabled?: boolean
): BalanceValidationHook {
	const inputRef = useRef<HTMLInputElement>();

	useEffect(() => {
		const input = inputRef.current;
		if (!input) return;
		if (!maxValue || disabled) return input.setCustomValidity("");

		input.setCustomValidity(
			currentValue.round(0, Balance.roundDown).gt(maxValue)
				? "Insufficient funds"
				: ""
		);
	}, [currentValue, maxValue, disabled]);

	return { inputRef };
}
