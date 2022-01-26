import React, { useState, useEffect } from "react";
import store from "store";
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
import { tokenChainIds } from "../../utils/network";

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

const TokenPicker: React.FC<{ setToken: Function }> = ({ setToken }) => {
	const [tokens, setTokens] = useState<Object[]>([{}]);
	const [selectedToken, setSelectedToken] = useState("");
	const assets = useAssets();

	useEffect(() => {
		const location = store.get("location");
		if (location === "exchange" && assets) {
			let tokes: Object[] = [];

			assets.map((asset) => {
				asset.symbol === "ETH"
					? tokes.push({
							symbol: asset.symbol,
							logo: ETH_LOGO,
					  })
					: tokes.push({
							symbol: asset.symbol,
							logo: `/images/${asset.symbol.toLowerCase()}.svg`,
					  });
			});

			setTokens(tokes);
		} else {
			let tokes: Object[] = [
				{
					symbol: "ETH",
					logo: ETH_LOGO,
				},
			];
			const CENNZnetNetwork = window.localStorage.getItem("CENNZnet-network")
				? window.localStorage.getItem("CENNZnet-network")
				: "Azalea";

			ERC20Tokens.tokens.map((token) => {
				if (token.chainId === tokenChainIds[CENNZnetNetwork]) {
					tokes.push({ symbol: token.symbol, logo: token.logoURI });
				}
			});
			setTokens(tokes);
		}
	}, [assets]);

	useEffect(() => {
		const location = store.get("location");
		if (location === "exchange" && assets) {
			assets.map(
				(asset) => selectedToken === asset.symbol && setToken(String(asset.id))
			);
		} else {
			const CENNZnetNetwork = window.localStorage.getItem("CENNZnet-network")
				? window.localStorage.getItem("CENNZnet-network")
				: "Azalea";

			ERC20Tokens.tokens.map((token) => {
				if (
					(token.symbol === selectedToken &&
						token.chainId === tokenChainIds[CENNZnetNetwork]) ||
					selectedToken === "ETH"
				) {
					selectedToken === "ETH" ? setToken(ETH) : setToken(token.address);
				}
			});
		}
	}, [assets, selectedToken, setToken]);

	return (
		<FormControl sx={{ width: "80%", mt: "50px" }} required>
			<InputLabel>Token</InputLabel>
			<Select
				required
				value={selectedToken}
				onChange={(e) => setSelectedToken(e.target.value)}
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
