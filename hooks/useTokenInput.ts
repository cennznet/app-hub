import { CENNZAsset, EthereumToken } from "@/types";
import { SelectChangeEvent } from "@mui/material";
import {
	ChangeEventHandler,
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react";

type TokenId = CENNZAsset["assetId"] | EthereumToken["address"];
type ReturnType = [
	{
		tokenId: TokenId;
		setTokenId: Dispatch<SetStateAction<TokenId>>;
		onTokenChange: (event: SelectChangeEvent) => void;
	},
	{
		value: string;
		setValue: Dispatch<SetStateAction<string>>;
		onValueChange: ChangeEventHandler<HTMLInputElement>;
	}
];

export default function useTokenInput(
	defaultToken?: TokenId,
	typeCast?: (value: TokenId) => TokenId
): ReturnType {
	const [tokenId, setTokenId] = useState<TokenId>(defaultToken);
	const onTokenChange = useCallback(
		(event: SelectChangeEvent) => {
			setTokenId(typeCast ? typeCast(event.target.value) : event.target.value);
		},
		[typeCast]
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
