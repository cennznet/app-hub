import React, { useState, useEffect } from "react";
import {
	FormControl,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
} from "@mui/material";
import ERC20Tokens from "../../artifacts/erc20tokens.json";
import { ETH, ETH_LOGO } from "../../utils/helpers";
import { useAssets } from "../../providers/SupportedAssetsProvider";
import { Asset } from "../../types/exchange";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

const TokenPicker: React.FC<{
	setToken: Function;
	cennznet?: boolean;
	forceSelection?: Asset;
	removeToken?: Asset;
}> = ({ setToken, cennznet = false, forceSelection, removeToken }) => {
	const [tokens, setTokens] = useState<Object[]>([{}]);
	const [selectedToken, setSelectedToken] = useState("");
	const assets = useAssets();

	useEffect(() => {
		if (forceSelection) setSelectedToken(forceSelection.symbol);
	}, [forceSelection]);

	useEffect(() => {
		if (cennznet && assets) {
			let tokes: Asset[] = [];

			assets.map((asset) => {
				asset.symbol === "ETH"
					? tokes.push({
							id: asset.id,
							symbol: asset.symbol,
							logo: ETH_LOGO,
							decimals: asset.decimals,
					  })
					: tokes.push({
							id: asset.id,
							symbol: asset.symbol,
							logo: `/images/${asset.symbol.toLowerCase()}.svg`,
							decimals: asset.decimals,
					  });
			});
			if (removeToken)
				tokes = tokes.filter((toke) => toke.id !== removeToken.id);
			setTokens(tokes);
		}
		//TODO potentially add spinner here while assets are being retrieved
		else if (cennznet && !assets) setTokens([]);
		else {
			let tokes: Object[] = [
				{
					symbol: "ETH",
					logo: ETH_LOGO,
				},
			];

			ERC20Tokens.tokens.map((token) => {
				if (token.chainId === Number(ETH_CHAIN_ID)) {
					tokes.push({ symbol: token.symbol, logo: token.logoURI });
				}
			});
			setTokens(tokes);
		}
	}, [cennznet, assets, removeToken]);

	useEffect(() => {
		if (cennznet && assets) {
			assets.map((asset) => selectedToken === asset.symbol && setToken(asset));
		} else {
			ERC20Tokens.tokens.map((token) => {
				if (
					(token.symbol === selectedToken &&
						token.chainId === Number(ETH_CHAIN_ID)) ||
					selectedToken === "ETH"
				) {
					selectedToken === "ETH" ? setToken(ETH) : setToken(token.address);
				}
			});
		}
	}, [cennznet, assets, selectedToken, setToken]);

	return (
		<FormControl
			sx={{
				width: cennznet ? "40%" : "80%",
				mt: cennznet ? "30px" : "50px",
			}}
			required
		>
			<InputLabel>Token</InputLabel>
			<Select
				required
				value={selectedToken}
				onChange={(e) => {
					setSelectedToken(e.target.value);
				}}
				input={<OutlinedInput label="Token" />}
				MenuProps={MenuProps}
				sx={{ fontSize: "18px" }}
			>
				{tokens.map((token: any, i) => (
					<MenuItem
						key={i}
						value={token.symbol}
						sx={{
							fontSize: "18px",
						}}
					>
						<img
							key={`img ${token.logo}`}
							alt="token logo"
							src={token.logo}
							style={{ marginRight: "12px", width: "20px" }}
						/>
						{token.symbol}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default TokenPicker;
