import type { ChainOption, IntrinsicElements } from "@/libs/types";

import { css, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { useMemo, forwardRef } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { AccountIdenticon } from "@/libs/components";
import { isCENNZAddress, isEthereumAddress } from "@/libs/utils";

interface AddressInputProps {
	addressType: ChainOption;
}

const AddressInput = forwardRef<
	HTMLInputElement,
	IntrinsicElements["input"] & AddressInputProps & TextFieldProps
>(({ addressType, value, ...props }, ref) => {
	const topAdornment = useMemo(() => {
		if (addressType === "Ethereum" && !isEthereumAddress(value as string))
			return;
		if (addressType === "CENNZnet" && !isCENNZAddress(value as string)) return;

		if (addressType === "Ethereum")
			return (
				<Jazzicon diameter={28} seed={jsNumberForAddress(value as string)} />
			);

		if (addressType === "CENNZnet")
			return (
				<AccountIdenticon theme="beachball" size={28} value={value as string} />
			);

		return null;
	}, [addressType, value]);

	return (
		<TextField
			multiline={true}
			type="text"
			inputRef={ref}
			css={styles.root}
			value={value}
			required
			InputProps={{
				startAdornment: (
					<InputAdornment position="start" css={styles.adornment}>
						{topAdornment}
					</InputAdornment>
				),
			}}
			{...props}
		/>
	);
});

AddressInput.displayName = "AddressInput";

export default AddressInput;

const styles = {
	root: css`
		width: 100%;
	`,

	brandLogo: css`
		width: 28px;
		position: absolute;
	`,

	metaMaskLogo: css`
		width: 26px;
	`,

	adornment: css`
		margin-right: 0;
		> div {
			margin-right: 0.5em !important;
		}
	`,
};
