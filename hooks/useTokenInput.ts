import { SelectChangeEvent } from "@mui/material";
import { Dispatch, SetStateAction, useCallback, useState } from "react";

export type TokenInputHook<T> = [
	{
		tokenId: T;
		setTokenId: Dispatch<SetStateAction<T>>;
		onTokenChange: (event: SelectChangeEvent) => void;
	},
	{
		value: string;
		setValue: Dispatch<SetStateAction<string>>;
		onValueChange: (value: string) => void;
	}
];

export default function useTokenInput<T>(defaultTokenId: T): TokenInputHook<T> {
	const [tokenId, setTokenId] = useState<T>(defaultTokenId);
	const onTokenChange = useCallback(
		(event: SelectChangeEvent) => {
			const value = event.target.value;
			setTokenId(
				typeof defaultTokenId === "number" ? (Number(value) as any) : value
			);
		},
		[defaultTokenId]
	);

	const [value, setValue] = useState<string>("");
	const onValueChange = useCallback<(value: string) => void>((value) => {
		setValue(value);
	}, []);

	return [
		{
			tokenId,
			setTokenId,
			onTokenChange,
		},
		{
			value,
			setValue,
			onValueChange,
		},
	];
}
