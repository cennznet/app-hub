import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import {
	Button,
	FormControl,
	CircularProgress,
	ClickAwayListener,
} from "@mui/material";
import { fetchMetamaskBalance } from "@/utils/bridge";
import { formatBalance, getTokenLogo, fetchCENNZAssetBalances } from "@/utils";
import {
	Asset,
	PoolConfig,
	CENNZAsset,
	CENNZAssetBalance,
	EthereumToken,
} from "@/types";
import { useBridge } from "@/providers/BridgeCurrentProvider";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { LegacyPoolAction as PoolAction } from "@/providers/PoolProvider";

const TokenPicker: React.FC<{
	assets?: Asset[];
	toChain?: string;
	setToken: Function;
	setAmount?: Function;
	amount?: string;
	forceSelection?: CENNZAsset;
	removeToken?: CENNZAsset;
	showBalance?: boolean;
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
			let ethereumTokens: EthereumToken[] = assets as EthereumToken[];
			setTokens(ethereumTokens);
			setToken(ethereumTokens[0]);
			setSelectedTokenIdx(0);
			setAssetsLoading(false);
			return;
		}

		let CENNZAssets: CENNZAsset[] = assets as CENNZAsset[];
		if (removeToken)
			CENNZAssets = CENNZAssets.filter(
				(asset) => asset.assetId !== removeToken.assetId
			);

		let foundTokenIdx: number;
		if (forceSelection) {
			foundTokenIdx = CENNZAssets.findIndex(
				(asset) => asset.assetId === forceSelection.assetId
			);
		}

		if (toChain === "Ethereum")
			CENNZAssets = CENNZAssets.filter((asset) => asset.symbol !== "CPAY");

		setTokens(CENNZAssets);
		setSelectedTokenIdx(forceSelection ? foundTokenIdx : 0);
		setToken(CENNZAssets[forceSelection ? foundTokenIdx : 0]);
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
		setSelectedTokenBalance(foundTokenBalance?.value.toNumber());
		setDisplayTokenBalance(formatBalance(foundTokenBalance?.value.toNumber()));
	}, [balances, selectedTokenIdx, tokens, Account, toChain]);

	const getBalanceDisplayText = () => {
		let displayBalanceText: string;
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
		<div css={styles.tokenPickerContainer}>
			<div
				css={styles.tokenPickerBox}
				style={{ width: width ? width : "468px" }}
			>
				<FormControl
					sx={{
						width: "142px",
					}}
				>
					<div css={styles.tokenSelector}>
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
									css={styles.tokenSelectedImg}
									alt=""
									src={getTokenLogo(tokens[selectedTokenIdx]?.symbol)?.src}
									width={33}
									height={33}
								/>
								<button
									type="button"
									css={styles.tokenButton(
										tokens[selectedTokenIdx]?.symbol.length
									)}
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
											css={
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
								<div css={styles.tokenDropdownContainer}>
									{tokens.map((token: any, i) => {
										return (
											<div
												key={i}
												onClick={() => {
													setSelectedTokenIdx(i);
													setToken(tokens[i]);
													setTokenDropDownActive(false);
												}}
												css={styles.tokenChoiceContainer}
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
				<div css={styles.amountContainer}>
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
						css={styles.amountInput}
						type="number"
						placeholder={"0.00"}
						value={amount}
						disabled={assetsLoading || !balances}
						onChange={(event) => {
							whichAsset
								? poolConfig.setOtherAsset(event.target.value, whichAsset)
								: setAmount(event.target.value);
						}}
					/>
				</div>
			</div>
			<div css={styles.bottomTextContainer}>
				{showBalance && (
					<p css={styles.balanceText}>{getBalanceDisplayText()}</p>
				)}
				{error && <p css={styles.errorMsg}>{error}</p>}
				{success && <p css={styles.successMsg}>{success}</p>}
			</div>
		</div>
	);
};

export default TokenPicker;

export const styles = {
	tokenPickerContainer: css`
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		margin-bottom: 17px;
		height: 94px;
	`,
	tokenPickerBox: css`
		display: flex;
		flex-direction: row;
		border: 1px solid #979797;
		width: 468px;
		height: 60px;
		margin-top: 50px;
		justify-content: space-between;
		align-items: center;
	`,
	amountContainer: css`
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	`,
	amountInput: css`
		height: 60px;
		width: 150px;
		font-style: normal;
		font-weight: bold;
		font-size: 16px;
		line-height: 16px;
		display: flex;
		align-items: center;
		text-align: right;
		color: #020202;
		margin-right: 12px;
		border: 1px solid #979797;
		border-left: none;
		border-right: none;
		background: transparent;

		&:focus-visible {
			outline: none;
		}
	`,
	tokenSelector: css`
		height: 60px;
		border: 1px solid #979797;
		border-left: none;
		border-right: none;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;

		&:focus-visible {
			outline: none;
		}
	`,
	tokenSelectedImg: css`
		margin-left: 13px;
	`,
	tokenSelectedArrow: css`
		margin-left: 15px;
	`,
	tokenSelectedArrowDown: css`
		margin-left: 15px;
		transform: rotate(-180deg);
	`,
	tokenButton: (tokenSymbolLength: number) => css`
		cursor: pointer;
		height: 60px;
		width: 100px;
		border: 1px solid #979797;
		border-left: none;
		border-right: none;
		position: relative;
		background-color: transparent;
		font-style: normal;
		font-weight: bold;
		font-size: ${tokenSymbolLength > 5 ? "11.5px" : "14px"};
		line-height: 125%;
		text-align: left;
		margin-left: 6px;
	`,
	tokenDropdownContainer: css`
		position: absolute;
		top: 60px;
		right: 3px;
		background: #ffffff;
		box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
		z-index: 5;
		width: 140px;
		min-height: 165px;
		height: 100%;
		overflow: auto;

		span {
			padding: 12px 8px;
			margin-top: 5px;
			text-decoration: none;
			font-style: normal;
			font-weight: bold;
			font-size: 14px;
			line-height: 125%;
			display: flex;
			align-items: center;
			letter-spacing: 1.12428px;
			text-transform: uppercase;
			color: #020202;
			justify-content: center;
		}
	`,
	tokenChoiceContainer: css`
		cursor: pointer;
		display: flex;
		flex-direction: row;

		img {
			margin-left: 11px;
			margin-top: 7px;
			margin-bottom: 7px;
		}

		&:hover {
			background: #e5e8ff;
		}
	`,
	bottomTextContainer: css`
		font-style: normal;
		font-weight: 600;
		font-size: 16px;
		line-height: 19px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
	`,
	balanceText: css`
		margin-top: 12px;
		font-weight: bold;
	`,
	errorMsg: css`
		margin-top: 12px;
		color: #ec022c;
	`,
	successMsg: css`
		margin-top: 12px;
		color: green;
	`,
};
