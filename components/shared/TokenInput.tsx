import {
	FC,
	MutableRefObject,
	InputHTMLAttributes,
	useCallback,
	useMemo,
	useEffect,
} from "react";
import { css } from "@emotion/react";
import { Select, SelectChangeEvent, MenuItem, Theme } from "@mui/material";
import { CENNZAsset, EthereumToken } from "@/types";
import getTokenLogo from "@/utils/getTokenLogo";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useIMask, IMask } from "react-imask";

interface TokenInputProps {
	tokens: Partial<CENNZAsset & EthereumToken>[];
	selectedTokenId: number | string;
	onTokenChange: (event: SelectChangeEvent) => void;
	onMaxValueRequest?: () => void;
	onValueChange: (value: string) => void;
}

const TokenInput: FC<
	Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> &
		Pick<IMask.MaskedNumberOptions, "scale" | "padFractionalZeros"> &
		TokenInputProps
> = ({
	selectedTokenId,
	onTokenChange,
	tokens,
	onMaxValueRequest,
	placeholder = "0",
	onValueChange,
	scale,
	padFractionalZeros,
	disabled,
	value,
	...props
}) => {
	const imaskOptions = useMemo(
		() => ({
			scale,
			padFractionalZeros,
			radix: ".",
			mask: Number,
		}),
		[padFractionalZeros, scale]
	);

	const onIMaskAccept = useCallback(
		(value) => {
			onValueChange?.(value);
		},
		[onValueChange]
	);

	const { ref: inputRef, setValue } = useIMask(imaskOptions, {
		onAccept: onIMaskAccept,
	});

	useEffect(() => {
		setValue?.(value as string);
	}, [value, setValue]);
	return (
		<div css={[styles.root, !disabled && styles.rootHover]}>
			<Select
				css={styles.select}
				value={selectedTokenId}
				onChange={onTokenChange}
				MenuProps={{ sx: styles.selectDropdown as any }}
				IconComponent={ExpandMore}
				autoWidth={false}
			>
				{!!tokens?.length &&
					tokens.map((coin) => {
						const { symbol, assetId, address } = coin;
						const logo = getTokenLogo(symbol);
						const value = address || assetId;
						return (
							<MenuItem key={value} value={value} css={styles.selectItem}>
								{logo && <img src={logo.src} alt={symbol} />}
								<span>{coin.symbol}</span>
							</MenuItem>
						);
					})}
			</Select>
			{onMaxValueRequest && (
				<div css={styles.maxButton} onClick={onMaxValueRequest}>
					Max
				</div>
			)}
			{!disabled && (
				<input
					{...props}
					ref={inputRef as MutableRefObject<HTMLInputElement>}
					css={styles.input}
					type="number"
					autoComplete="off"
					autoCorrect="off"
					step="any"
					placeholder={placeholder}
				/>
			)}

			{disabled && (
				<input
					{...props}
					disabled={true}
					css={styles.input}
					type="text"
					autoComplete="off"
					autoCorrect="off"
					placeholder={placeholder}
					value={value}
					onChange={(event) => onValueChange(event.target.value)}
				/>
			)}
		</div>
	);
};

export default TokenInput;

export const styles = {
	root: ({ palette }: Theme) => css`
		width: 100%;
		border: 1px solid ${palette.text.secondary};
		border-radius: 4px;
		overflow: hidden;
		display: flex;
		align-items: center;
		transition: border-color 0.2s;

		.MuiOutlinedInput-notchedOutline {
			border: none;
		}

		.MuiSelect-select {
			display: flex;
			align-items: center;
			padding-top: 0.75em;
			padding-bottom: 0.75em;
			> img {
				width: 2em;
				height: 2em;
				object-fit: contain;
				margin-right: 0.5em;
			}

			> span {
				font-size: 0.875em;
				font-weight: bold;
				flex: 1;
			}
		}
	`,

	rootHover: ({ palette }: Theme) => css`
		&:hover,
		&:focus {
			border-color: ${palette.primary.main};
		}
	`,

	select: ({ palette, transitions }: Theme) => css`
		border: none;
		min-width: 135px;

		&:hover,
		& .MuiSelect-select[aria-expanded="true"] {
			color: ${palette.text.highlight};

			.MuiSvgIcon-root {
				color: ${palette.text.highlight};
			}
		}

		.MuiList-root {
			padding: 0;
		}

		.MuiSvgIcon-root {
			transition: transform ${transitions.duration.shortest}ms
				${transitions.easing.easeInOut};
		}

		.MuiSelect-iconOpen {
			color: ${palette.primary.main};
		}
	`,

	selectDropdown: ({ palette, shadows }: Theme) => css`
		.MuiPaper-root {
			border-radius: 4px;
			overflow: hidden;
			transform: translate(-1px, 5px) !important;
			box-shadow: ${shadows[1]};
			border: 1px solid ${palette.secondary.main};
		}

		.MuiMenu-list {
			padding: 0;
		}
	`,

	selectItem: css`
		display: flex;
		padding-top: 0.75em;
		padding-bottom: 0.75em;

		> img {
			width: 2em;
			height: 2em;
			object-fit: contain;
			margin-right: 0.5em;
		}

		> span {
			font-size: 0.875em;
			font-weight: bold;
			flex: 1;
		}
	`,

	input: ({ palette }: Theme) => css`
		border: none;
		width: 100%;
		line-height: 1;
		padding: 0.5em;
		margin: 0.45em;
		text-align: right;
		outline: none;
		font-family: "Roboto Mono", monospace;
		font-weight: 600;
		-moz-appearance: textfield;

		&:disabled {
			background-color: white;
			color: inherit;
			cursor: not-allowed;
		}

		&::placeholder {
			color: ${palette.text.primary};
		}

		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
	`,

	maxButton: ({ palette }: Theme) => css`
		font-weight: bold;
		text-transform: uppercase;
		padding: 0 0.5em;
		cursor: pointer;
		font-size: 0.875em;
		color: ${palette.text.primary};
		transition: color 0.2s;

		&:hover {
			color: ${palette.primary.main};
		}
	`,
};
