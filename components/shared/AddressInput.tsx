import { BridgeChain, IntrinsicElements } from "@/types";
import {
	css,
	InputAdornment,
	TextField,
	TextFieldProps,
	Theme,
} from "@mui/material";
import { useMemo, forwardRef } from "react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import AccountIdenticon from "@/components/shared/AccountIdenticon";
import isEthereumAddress from "@/utils/isEthereumAddress";
import isCENNZAddress from "@/utils/isCENNZAddress";

interface AddressInputProps {
	addressType: BridgeChain;
}

const AddressInput = forwardRef<
	HTMLInputElement,
	IntrinsicElements["input"] & AddressInputProps & TextFieldProps
>(({ addressType, value, ...props }, ref) => {
	const topAdorment = useMemo(() => {
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
					<InputAdornment position="start" css={styles.adorment}>
						{topAdorment}
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

	adorment: ({ palette }: Theme) => css`
		margin-right: 0;
		> div {
			margin-right: 0.5em !important;
		}
	`,
};
