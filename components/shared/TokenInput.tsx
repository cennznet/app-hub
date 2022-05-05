import {
	MutableRefObject,
	InputHTMLAttributes,
	useCallback,
	useMemo,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";
import { css, SerializedStyles } from "@emotion/react";
import { SelectChangeEvent, MenuItem, Theme } from "@mui/material";
import { CENNZAsset, EthereumToken } from "@/types";
import getTokenLogo from "@/utils/getTokenLogo";
import { useIMask, IMask } from "react-imask";
import SelectInput from "@/components/shared/SelectInput";

interface TokenInputProps {
	tokens: Partial<CENNZAsset & EthereumToken>[];
	selectedTokenId: number | string;
	onTokenChange: (event: SelectChangeEvent) => void;
	onMaxValueRequest?: () => void;
	onValueChange: (value: string) => void;
	css?: SerializedStyles;
}

const TokenInput = forwardRef<
	HTMLInputElement,
	Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> &
		Pick<IMask.MaskedNumberOptions, "scale"> &
		TokenInputProps
>(
	(
		{
			selectedTokenId,
			onTokenChange,
			tokens,
			onMaxValueRequest,
			placeholder = "0.0",
			onValueChange,
			scale,
			value,
			css,
			children,
			...props
		},
		ref
	) => {
		const imaskOptions = useMemo(
			() => ({
				mask: `[0000000000].[${new Array(scale || 1).fill(0).join("")}]`,
			}),
			[scale]
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

		useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

		useEffect(() => {
			setValue?.((value === "0" ? "" : value) as string);
		}, [value, setValue]);
		return (
			<div css={[styles.root, styles.rootHover, css]}>
				<SelectInput
					css={styles.select}
					value={selectedTokenId}
					onChange={onTokenChange}
					inputProps={{ sx: styles.selectItem as any }}
					readOnly={tokens?.length <= 1}
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
				</SelectInput>
				{onMaxValueRequest && (
					<div css={styles.maxButton} onClick={onMaxValueRequest}>
						Max
					</div>
				)}
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

				{children}
			</div>
		);
	}
);

TokenInput.displayName = "TokenInput";

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
		position: relative;

		.MuiOutlinedInput-notchedOutline {
			border: none;
		}
	`,

	rootHover: ({ palette }: Theme) => css`
		&:hover,
		&:focus {
			border-color: ${palette.primary.main};
		}
	`,

	select: css`
		min-width: 135px;
	`,

	selectItem: css`
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
			font-size: 14px;
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
		letter-spacing: -0.025em;

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
		font-size: 14px;
		color: ${palette.text.primary};
		transition: color 0.2s;

		&:hover {
			color: ${palette.primary.main};
		}
	`,
};
