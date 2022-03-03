import { FC, InputHTMLAttributes } from "react";
import { css } from "@emotion/react";
import { Select, SelectChangeEvent, MenuItem, Theme } from "@mui/material";
import { CENNZAsset, EthereumToken } from "@/types";
import getTokenLogo from "@/utils/getTokenLogo";
import ExpandLess from "@mui/icons-material/ExpandLess";

interface TokenInputProps {
	coinsList: Partial<CENNZAsset & EthereumToken>[];
	token: number | string;
	onTokenChange: (event: SelectChangeEvent) => void;
	onMaxValueRequest?: () => void;
}

const TokenInput: FC<
	TokenInputProps & InputHTMLAttributes<HTMLInputElement>
> = ({ token, onTokenChange, coinsList, onMaxValueRequest, ...props }) => {
	return (
		<div css={styles.root}>
			<Select
				css={styles.select}
				value={token}
				onChange={onTokenChange}
				MenuProps={{ sx: styles.selectDropdown as any }}
				IconComponent={ExpandLess}
			>
				{coinsList.map((coin) => {
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
			{onMaxValueRequest && <div css={styles.maxButton}>Max</div>}
			<input css={styles.input} {...props} type="number" />
		</div>
	);
};

export default TokenInput;

export const styles = {
	root: css`
		width: 100%;
		border: 1px solid #979797;
		border-radius: 4px;
		overflow: hidden;
		display: flex;
		align-items: center;

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
				font-weight: bold;
			}
		}
	`,

	select: css`
		border: none;

		.MuiList-root {
			padding: 0;
		}

		.MuiSvgIcon-root {
			transition: transform 0.1s, color 0.1s;
		}

		.MuiSelect-iconOpen {
			color: #1130ff;
		}
	`,

	selectDropdown: css`
		.MuiPaper-root {
			border-radius: 4px;
			overflow: hidden;
			transform: translate(-1px, 5px) !important;
			box-shadow: 4px 8px 8px rgba(0, 0, 0, 0.1);
			border: 1px solid rgba(17, 48, 255, 0.35);
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
		font-weight: bold;

		&::placeholder {
			color: ${palette.text.secondary};
		}
	`,

	maxButton: ({ palette }: Theme) => css`
		font-weight: bold;
		text-transform: uppercase;
		padding: 0 0.5em;
		cursor: pointer;
	`,
};
