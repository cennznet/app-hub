import { FC, InputHTMLAttributes } from "react";
import { css } from "@emotion/react";
import { Select, SelectChangeEvent, MenuItem, Theme } from "@mui/material";
import { CENNZAsset, EthereumToken } from "@/types";
import getTokenLogo from "@/utils/getTokenLogo";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { IMaskInput, IMask } from "react-imask";

interface TokenInputProps {
	tokens: Partial<CENNZAsset & EthereumToken>[];
	selectedTokenId: number | string;
	onTokenChange: (event: SelectChangeEvent) => void;
	onMaxValueRequest?: () => void;
	onValueChange: (value: string) => void;
}

const TokenInput: FC<
	InputHTMLAttributes<HTMLInputElement> &
		Omit<IMask.MaskedNumberOptions, "mask"> &
		TokenInputProps
> = ({
	selectedTokenId,
	onTokenChange,
	tokens,
	onMaxValueRequest,
	placeholder = "0.0",
	onValueChange,
	min,
	max,
	disabled,
	...props
}) => {
	return (
		<div css={[styles.root, !disabled && styles.rootHover]}>
			<Select
				css={styles.select}
				value={selectedTokenId}
				onChange={onTokenChange}
				MenuProps={{ sx: styles.selectDropdown as any }}
				IconComponent={ExpandLess}
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
			<IMaskInput
				{...props}
				disabled={disabled}
				mask={Number}
				css={styles.input}
				type={disabled ? "text" : "number"}
				autoComplete="off"
				autoCorrect="off"
				radix="."
				onAccept={onValueChange}
				placeholder={placeholder}
			/>
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
		}

		&::placeholder {
			color: ${palette.text.secondary};
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
