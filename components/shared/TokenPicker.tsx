import React, { useState, useEffect } from "react";
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	TextField,
} from "@mui/material";
import ERC20Tokens from "../../artifacts/erc20tokens.json";
import { ETH, ETH_LOGO } from "../../utils/bridge/helpers";
import { useAssets } from "../../providers/SupportedAssetsProvider";
import { Asset } from "../../types";
import { useBlockchain } from "../../providers/BlockchainProvider";
import { useRouter } from "next/router";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

import styles from "../../styles/components/shared/tokenpicker.module.css";

export type BridgeToken = {
	chainId: number;
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	logoURI: string;
};

const TokenPicker: React.FC<{
	setToken: Function;
	cennznet?: boolean;
	forceSelection?: Asset;
	removeToken?: Asset;
}> = ({ setToken, cennznet = false, forceSelection, removeToken }) => {
	const router = useRouter();
	const [tokens, setTokens] = useState<Object[]>();
	const [tokenDropDownActive, setTokenDropDownActive] =
		useState<boolean>(false);
	const [selectedToken, setSelectedToken] = useState<string>("");
	const assets = useAssets();
	const { Account } = useBlockchain();

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
			ERC20Tokens.tokens.map((token: BridgeToken) => {
				if (
					(token.symbol === selectedToken &&
						token.chainId === Number(ETH_CHAIN_ID)) ||
					selectedToken === "ETH"
				) {
					selectedToken === "ETH"
						? setToken({ address: ETH, symbol: "ETH", decimals: 18 })
						: setToken(token);
				}
			});
		}
	}, [cennznet, assets, selectedToken, setToken]);

	return (
		<FormControl
			sx={{
				width: "80%",
				mt: "30px",
			}}
			required
			disabled={router.asPath === "/bridge" ? (Account ? false : true) : false}
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
				{tokens?.map((token: any, i) => (
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
