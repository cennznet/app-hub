import React, { useState, useEffect } from "react";
import {
	Button,
	FormControl,
	CircularProgress,
	ClickAwayListener,
} from "@mui/material";
import ERC20Tokens from "@/artifacts/erc20tokens.json";
import { ETH, fetchMetamaskBalance } from "@/utils/bridge";
import { useAssets } from "@/providers/SupportedAssetsProvider";
import {
	Asset,
	PoolConfig,
	CENNZAsset,
	CENNZAssetBalance,
	EthereumToken,
} from "@/types";
import styles from "@/styles/components/shared/TokenPicker.module.css";
import { useBridge } from "@/providers/BridgeProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { PoolAction } from "@/providers/PoolProvider";
import {
	formatBalance,
	getTokenLogo,
	fetchCENNZAssetBalances,
	fetchBridgeTokens,
} from "@/utils";

const ETH_CHAIN_ID = process.env.NEXT_PUBLIC_ETH_CHAIN_ID;

const TokenPicker: React.FC<{
	assets?: Asset[];
	toChain?: string;
	setToken: Function;
	setAmount?: Function;
	amount?: string;
	cennznet?: boolean;
	forceSelection?: CENNZAsset;
	removeToken?: CENNZAsset;
	showBalance?: boolean;
	wrappedERC20Balance?: boolean;
	error?: string;
	success?: string;
	poolConfig?: PoolConfig;
	whichAsset?: string;
	width?: string;
}> = ({
	assets,
	toChain,
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
}) => {
	const [assetsLoading, setAssetsLoading] = useState<boolean>(true);
	const [tokens, setTokens] = useState<Asset[]>();
	const [balances, setBalances] = useState<CENNZAssetBalance[]>();
	const [tokenDropDownActive, setTokenDropDownActive] =
		useState<boolean>(false);
	const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>();
	const [selectedTokenBalance, setSelectedTokenBalance] = useState<number>();
	const [displayTokenBalance, setDisplayTokenBalance] = useState<string>();
	const { Account } = useBridge();
	const { selectedAccount } = useCENNZWallet();
	const { api } = useCENNZApi();

	useEffect(() => {
		if (!api || !selectedAccount) return;
		(async () =>
			setBalances(
				await fetchCENNZAssetBalances(api, selectedAccount.address)
			))();
	}, [api, selectedAccount]);

	useEffect(() => {
		if (!assets) return;

		if (toChain === "CENNZnet") {
			let tokes: EthereumToken[] = assets as EthereumToken[];
			setTokens(tokes);
			setToken(tokes[0]);
			setSelectedTokenIdx(0);
			setAssetsLoading(false);
			return;
		}

		let tokes: CENNZAsset[] = assets as CENNZAsset[];
		if (removeToken)
			tokes = tokes.filter((asset) => asset.assetId !== removeToken.assetId);

		let foundTokenIdx: number;
		if (forceSelection) {
			foundTokenIdx = tokes.findIndex(
				(asset) => asset.assetId === forceSelection.assetId
			);
		}

		if (toChain === "Ethereum")
			tokes = tokes.filter(
				(asset) => asset.symbol !== "CENNZ" && asset.symbol !== "CPAY"
			);

		setTokens(tokes);
		setSelectedTokenIdx(forceSelection ? foundTokenIdx : 0);
		setToken(tokes[forceSelection ? foundTokenIdx : 0]);
		setAssetsLoading(false);
	}, [assets, forceSelection, removeToken, toChain, setToken]);

	useEffect(() => {
		if (selectedTokenIdx === undefined || !tokens) return;
		if (toChain === "CENNZnet") {
			if (!Account || !tokens[selectedTokenIdx]?.address) return;
			const { ethereum }: any = window;
			(async () => {
				const balance = await fetchMetamaskBalance(
					ethereum,
					tokens[selectedTokenIdx].address,
					Account
				);
				setSelectedTokenBalance(balance);
				setDisplayTokenBalance(formatBalance(balance));
			})();
			return;
		}

		if (!balances) return;
		const foundTokenBalance = balances.find(
			(asset) => asset.symbol === tokens[selectedTokenIdx]?.symbol
		);
		setSelectedTokenBalance(foundTokenBalance?.value);
		setDisplayTokenBalance(formatBalance(foundTokenBalance?.value));
	}, [balances, selectedTokenIdx, tokens, Account, toChain]);

	const getBalanceDisplayText = () => {
		let displayBalanceText = "";
		if (poolConfig?.poolAction === PoolAction.REMOVE) {
			displayBalanceText = "Withdrawable: ";
			if (whichAsset === "trade" && poolConfig.userPoolShare) {
				displayBalanceText =
					displayBalanceText +
					poolConfig?.userPoolShare?.assetBalance?.asString(
						poolConfig?.tradeAsset.decimals
					);
			} else if (poolConfig.userPoolShare) {
				displayBalanceText =
					displayBalanceText +
					poolConfig?.userPoolShare?.coreAssetBalance?.asString(
						poolConfig?.coreAsset.decimals
					);
			}
		} else {
			displayBalanceText = "Balance: ";
			if (displayTokenBalance !== undefined)
				displayBalanceText = displayBalanceText + displayTokenBalance;
		}
		return displayBalanceText;
	};

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
						{assetsLoading || !tokens[selectedTokenIdx] ? (
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
									src={getTokenLogo(tokens[selectedTokenIdx]?.symbol)?.src}
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
									style={{
										cursor: whichAsset !== "core" ? "pointer" : "default",
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
											src={"/images/arrow_up.svg"}
										/>
									)}
								</button>
							</>
						)}
						{tokenDropDownActive && (
							<ClickAwayListener
								onClickAway={() => setTokenDropDownActive(false)}
							>
								<div className={styles.tokenDropdownContainer}>
									{tokens.map((token: any, i) => {
										return (
											<div
												key={i}
												onClick={() => {
													setSelectedTokenIdx(i);
													setToken(tokens[i]);
													setTokenDropDownActive(false);
												}}
												className={styles.tokenChoiceContainer}
											>
												<img
													alt=""
													src={getTokenLogo(token.symbol)?.src}
													width={33}
													height={33}
												/>
												<span>{token.symbol}</span>
											</div>
										);
									})}
								</div>
							</ClickAwayListener>
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
						disabled={!displayTokenBalance}
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
						disabled={assetsLoading}
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
					<p className={styles.balanceText}>{getBalanceDisplayText()}</p>
				)}
				{error && <p className={styles.errorMsg}>{error}</p>}
				{success && <p className={styles.successMsg}>{success}</p>}
			</div>
		</div>
	);
};

export default TokenPicker;
