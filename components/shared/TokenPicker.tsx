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
	const [tokens, setTokens] = useState<Asset[]>();
	const [tokenDropDownActive, setTokenDropDownActive] =
		useState<boolean>(false);
	const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(0);
	const assets = useAssets();
	const { Account } = useBlockchain();

	useEffect(() => {
		if (forceSelection) {
			let newAssets: Asset[] = [...assets];
			if (removeToken)
				newAssets = assets.filter((toke) => toke.id !== removeToken.id);
			let foundtokenIdx = newAssets?.findIndex(
				(token) => forceSelection.symbol == token.symbol
			);
			setTokens(newAssets);
			setSelectedTokenIdx(foundtokenIdx);
		}
	}, [forceSelection]);

	useEffect(() => {
		if (cennznet && assets) {
			let tokes: Asset[] = assets;
			if (removeToken)
				tokes = tokes.filter((toke) => toke.id !== removeToken.id);
			setTokens(tokes);
		}
		//TODO potentially add spinner here while assets are being retrieved
		else if (cennznet && !assets) setTokens([]);
		else {
			let tokes: Asset[] = [
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
			setSelectedTokenIdx(0);
		}
	}, [cennznet, assets, removeToken]);

	useEffect(() => {
		if (cennznet && assets) {
			console.info(tokens[selectedTokenIdx]);
			setToken(tokens[selectedTokenIdx]);
		} else {
			ERC20Tokens.tokens.map((token: BridgeToken) => {
				if (
					(token.symbol === tokens[selectedTokenIdx]?.symbol &&
						token.chainId === Number(ETH_CHAIN_ID)) ||
					selectedToken === "ETH"
				) {
					selectedToken === "ETH"
						? setToken({ address: ETH, symbol: "ETH", decimals: 18 })
						: setToken(token);
				}
			});
		}
	}, [cennznet, assets, selectedTokenIdx, setToken]);

	return (
		<div className={styles.tokenPickerContainer}>
			<FormControl
				sx={{
					width: "142px",
				}}
			>
				<div className={styles.tokenSelector}>
					<img
						className={styles.tokenSelectedImg}
						alt=""
						src={
							selectedTokenIdx !== 0
								? tokens[selectedTokenIdx]?.logo
								: "/images/cennz.svg"
						}
						width={33}
						height={33}
					/>
					<button
						type="button"
						className={styles.tokenButton}
						onClick={() => setTokenDropDownActive(!tokenDropDownActive)}
					>
						{selectedTokenIdx !== 0
							? tokens[selectedTokenIdx]?.symbol
							: "CENNZ"}
						<img
							className={
								tokenDropDownActive
									? styles.tokenSelectedArrow
									: styles.tokenSelectedArrowDown
							}
							alt="arrow"
							src={"/arrow_up.svg"}
						/>
					</button>

					{tokenDropDownActive && (
						<div className={styles.tokenDropdownContainer}>
							{tokens.map((token: any, i) => {
								return (
									<div
										key={i}
										onClick={() => {
											setSelectedTokenIdx(i);
											setTokenDropDownActive(false);
										}}
										className={styles.tokenChoiceContainer}
									>
										<img alt="" src={token.logo} width={33} height={33} />
										<span>{token.symbol}</span>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</FormControl>
			<div className={styles.amountContainer}>
				<Button
					sx={{
						fontFamily: "Roboto",
						fontWeight: "bold",
						fontSize: "16px",
						lineHeight: "16px",
						color: "black",
						marginRight: "80px",
					}}
					size="large"
				>
					MAX
				</Button>
				<input
					className={styles.amountInput}
					type="number"
					placeholder={"0.00"}
				/>
			</div>
		</div>
	);
};

export default TokenPicker;
