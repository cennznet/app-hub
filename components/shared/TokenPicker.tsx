import React, { useState, useEffect } from "react";
import { Button, FormControl, CircularProgress } from "@mui/material";
import ERC20Tokens from "../../artifacts/erc20tokens.json";
import { ETH, ETH_LOGO } from "../../utils/bridge/helpers";
import { useAssets } from "../../providers/SupportedAssetsProvider";
import { Asset } from "../../types";
import { useBlockchain } from "../../providers/BlockchainProvider";
import { useRouter } from "next/router";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

import styles from "../../styles/components/shared/tokenpicker.module.css";
import { useWallet } from "../../providers/SupportedWalletProvider";

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
	setAmount?: Function;
	amount?: string;
	cennznet?: boolean;
	forceSelection?: Asset;
	removeToken?: Asset;
	showBalance?: boolean;
}> = ({
	setToken,
	setAmount,
	amount,
	cennznet = false,
	forceSelection,
	removeToken,
	showBalance,
}) => {
	const router = useRouter();
	const [assetsLoading, setAssetsLoading] = useState<boolean>(true);
	const [tokens, setTokens] = useState<Asset[]>();
	const [tokenDropDownActive, setTokenDropDownActive] =
		useState<boolean>(false);
	const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(0);
	const [selectedTokenBalance, setSelectedTokenBalance] = useState<number>();
	const assets = useAssets();
	const { Account } = useBlockchain();
	const { balances } = useWallet();

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
			let tokes: Asset[] = [...assets];
			if (removeToken)
				tokes = tokes.filter((toke) => toke.id !== removeToken.id);
			setTokens(tokes);
			setSelectedTokenIdx(0);
			setAssetsLoading(false);
		} else if (cennznet && !assets) setTokens([]);
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
			setAssetsLoading(false);
		}
	}, [cennznet, assets, removeToken]);

	useEffect(() => {
		if (cennznet && assets && tokens) {
			setToken(tokens[selectedTokenIdx]);
		} else if (tokens) {
			ERC20Tokens.tokens.map((token: BridgeToken) => {
				if (
					(token.symbol === tokens[selectedTokenIdx]?.symbol &&
						token.chainId === Number(ETH_CHAIN_ID)) ||
					tokens[selectedTokenIdx]?.symbol === "ETH"
				) {
					tokens[selectedTokenIdx]?.symbol === "ETH"
						? setToken({ address: ETH, symbol: "ETH", decimals: 18 })
						: setToken(token);
				}
			});
		}
	}, [cennznet, assets, selectedTokenIdx, tokens]);

	useEffect(() => {
		if (!balances || !tokens) return;
		const foundTokenBalance = balances.find(
			(asset) => asset.symbol === tokens[selectedTokenIdx]?.symbol
		);
		setSelectedTokenBalance(foundTokenBalance.value);
	}, [balances, tokens, selectedTokenIdx]);

	return (
		<div className={styles.tokenPickerContainer}>
			<div className={styles.tokenPickerBox}>
				<FormControl
					sx={{
						width: "142px",
					}}
					disabled={router.asPath === "/bridge" ? !Account : false}
				>
					<div className={styles.tokenSelector}>
						{assetsLoading ? (
							<CircularProgress />
						) : (
							<>
								<img
									className={styles.tokenSelectedImg}
									alt=""
									src={tokens[selectedTokenIdx]?.logo}
									width={33}
									height={33}
								/>
								<button
									type="button"
									className={styles.tokenButton}
									onClick={() => setTokenDropDownActive(!tokenDropDownActive)}
								>
									{tokens[selectedTokenIdx]?.symbol}
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
							</>
						)}
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
							fontWeight: "bold",
							fontSize: "16px",
							lineHeight: "16px",
							color: "black",
							marginRight: "80px",
						}}
						size="large"
						disabled={!balances}
						onClick={() => setAmount(selectedTokenBalance)}
					>
						MAX
					</Button>
					<input
						className={styles.amountInput}
						type="number"
						placeholder={"0.00"}
						value={amount}
						onChange={(event) => setAmount(event.target.value)}
					/>
				</div>
			</div>
			{showBalance && selectedTokenBalance && (
				<p className={styles.balanceText}>
					{"Balance: " + selectedTokenBalance}
				</p>
			)}
		</div>
	);
};

export default TokenPicker;
