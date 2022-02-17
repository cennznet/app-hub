import React, { useState, useEffect } from "react";
import { Button, FormControl, CircularProgress } from "@mui/material";
import ERC20Tokens from "../../artifacts/erc20tokens.json";
import { ETH, ETH_LOGO, getMetamaskBalance } from "../../utils/bridge/helpers";
import { useAssets } from "../../providers/SupportedAssetsProvider";
import { Asset, PoolConfig, BridgeToken } from "../../types";
import { useBlockchain } from "../../providers/BlockchainProvider";
import { useRouter } from "next/router";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

import styles from "../../styles/components/shared/tokenpicker.module.css";
import { useWallet } from "../../providers/SupportedWalletProvider";
import { PoolAction } from "../../providers/PoolProvider";
import { useCENNZApi } from "../../providers/CENNZApiProvider";

const TokenPicker: React.FC<{
	setToken: Function;
	setAmount?: Function;
	amount?: string;
	cennznet?: boolean;
	forceSelection?: Asset;
	removeToken?: Asset;
	showBalance?: boolean;
	wrappedERC20Balance?: boolean;
	error?: string;
	success?: string;
	poolConfig?: PoolConfig;
	whichAsset?: string;
	width?: string;
}> = ({
	setToken,
	setAmount,
	amount,
	cennznet = false,
	forceSelection,
	removeToken,
	showBalance,
	error,
	success,
	poolConfig,
	whichAsset,
	width,
	wrappedERC20Balance,
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
	const { api }: any = useCENNZApi();
	const { bridgeBalances } = useWallet();

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
					address: ETH,
				},
			];

			ERC20Tokens.tokens.map((token: BridgeToken) => {
				if (token.chainId === Number(ETH_CHAIN_ID)) {
					tokes.push({
						symbol: token.symbol,
						logo: token.logoURI,
						address: token.address,
						decimals: token.decimals,
						name: token.name,
					});
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
		if (!tokens) return;
		if (cennznet) {
			if (!balances) return;
			const foundTokenBalance = balances.find(
				(asset) => asset.symbol === tokens[selectedTokenIdx]?.symbol
			);
			setSelectedTokenBalance(parseFloat(foundTokenBalance?.value.toFixed(4)));
		} else {
			if (wrappedERC20Balance) {
				if (!tokens[selectedTokenIdx] || !bridgeBalances || !api) return;
				(async () => {
					const tokenExist = await api.query.erc20Peg.erc20ToAssetId(
						tokens[selectedTokenIdx]?.address
					);

					const tokenId = tokenExist.isSome
						? tokenExist.unwrap()
						: await api.query.genericAsset.nextAssetId();
					const foundToken = Object.values(bridgeBalances).find(
						(token: any) => token.tokenId === tokenId.toString()
					);
					if (foundToken) {
						setSelectedTokenBalance(parseFloat(foundToken.balance.toFixed(4)));
					} else {
						setSelectedTokenBalance(0);
					}
				})();
			} else {
				if (!Account || !tokens[selectedTokenIdx]) return;
				const { ethereum }: any = window;
				(async () => {
					const balance = await getMetamaskBalance(
						ethereum,
						(tokens[selectedTokenIdx] as BridgeToken)?.address,
						Account
					);
					setSelectedTokenBalance(parseFloat(balance.toFixed(4)));
				})();
			}
		}
	}, [
		balances,
		tokens,
		selectedTokenIdx,
		Account,
		bridgeBalances,
		wrappedERC20Balance,
	]);

	return (
		<div className={styles.tokenPickerContainer}>
			<div
				className={styles.tokenPickerBox}
				style={{ width: width ? width : "468px" }}
			>
				<FormControl
					sx={{
						width: "142px",
					}}
				>
					<div className={styles.tokenSelector}>
						{assetsLoading ? (
							<CircularProgress
								size={30}
								sx={{
									color: poolConfig ? "#6200EE" : "#1130FF",
								}}
							/>
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
									onClick={() =>
										whichAsset !== "core"
											? setTokenDropDownActive(!tokenDropDownActive)
											: null
									}
									disabled={router.asPath === "/bridge" && !Account}
									style={{
										cursor: whichAsset !== "core" ? "hover" : "default",
									}}
								>
									{tokens[selectedTokenIdx]?.symbol}
									{whichAsset !== "core" && (
										<img
											className={
												tokenDropDownActive
													? styles.tokenSelectedArrow
													: styles.tokenSelectedArrowDown
											}
											alt="arrow"
											src={"/arrow_up.svg"}
										/>
									)}
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
						onClick={() =>
							whichAsset
								? poolConfig.setMax(whichAsset)
								: setAmount(selectedTokenBalance)
						}
					>
						MAX
					</Button>
					<input
						className={styles.amountInput}
						type="number"
						placeholder={"0.00"}
						value={amount}
						onChange={(event) => {
							whichAsset
								? poolConfig.setOtherAsset(event.target.value, whichAsset)
								: setAmount(event.target.value);
						}}
					/>
				</div>
			</div>
			<div className={styles.bottomTextContainer}>
				{showBalance && (
					<p className={styles.balanceText}>
						{poolConfig?.poolAction === PoolAction.REMOVE
							? whichAsset === "trade"
								? `Withdrawable: ${poolConfig?.userPoolShare.assetBalance.asString(
										poolConfig?.tradeAsset.decimals
								  )}`
								: `Withdrawable: ${poolConfig?.userPoolShare.coreAssetBalance.asString(
										poolConfig?.coreAsset.decimals
								  )}`
							: `Balance: ${
									selectedTokenBalance !== undefined ? selectedTokenBalance : ""
							  }`}
					</p>
				)}
				{error && <p className={styles.errorMsg}>{error}</p>}
				{success && <p className={styles.successMsg}>{success}</p>}
			</div>
		</div>
	);
};

export default TokenPicker;
