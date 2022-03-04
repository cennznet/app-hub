import { SelectChangeEvent } from "@mui/material";
import {
	ChangeEventHandler,
	Dispatch,
	SetStateAction,
	useCallback,
	useState,
} from "react";

type ReturnType<T> = [
	{
		tokenId: T;
		setTokenId: Dispatch<SetStateAction<T>>;
		onTokenChange: (event: SelectChangeEvent) => void;
	},
	{
		value: string;
		setValue: Dispatch<SetStateAction<string>>;
		onValueChange: ChangeEventHandler<HTMLInputElement>;
	}
];

export default function useTokenInput<T>(defaultTokenId: T): ReturnType<T> {
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
	const onValueChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			setValue(event.target.value);
		},
		[]
	);

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
