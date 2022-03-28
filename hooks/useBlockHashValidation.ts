import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { Hash } from "@cennznet/types";

interface BlockHashValidationHook {
	inputRef: MutableRefObject<HTMLInputElement | HTMLTextAreaElement>;
}

export default function useBlockHashValidation(
	hash: string
): BlockHashValidationHook {
	const { api } = useCENNZApi();
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>();

	const validateBlockHash = useCallback(async () => {
		const input: HTMLInputElement | HTMLTextAreaElement = inputRef.current;
		if (!api || !hash)
			return input.setCustomValidity("Please enter block hash");
		try {
			await api.rpc.chain.getBlock(hash as unknown as Hash);
			input.setCustomValidity("");
		} catch (err) {
			console.log(`Invalid block hash, ${err.message}`);
			input.setCustomValidity("Invalid block hash");
		}
	}, [api, hash, inputRef]);

	useEffect(() => {
		validateBlockHash();
	}, [validateBlockHash]);

	return { inputRef };
}
