import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@mui/material";
import TokenPicker from "../../components/shared/TokenPicker";
import ExchangeIcon from "../../components/swap/ExchangeIcon";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import { useAssets } from "../../providers/SupportedAssetsProvider";
import { Amount, AmountUnit } from "../../utils/Amount";
import { Asset } from "../../types";
import BigNumber from "bignumber.js";

import styles from "../../styles/components/swap/swap.module.css";
import { useWallet } from "../../providers/SupportedWalletProvider";
import { useDappModule } from "../../providers/DappModuleProvider";

const Exchange: React.FC<{}> = () => {
	const [exchangeToken, setExchangeToken] = useState<Asset>();
	const [receivedToken, setReceivedToken] = useState<Asset>();
	const [receivedTokenValue, setReceivedTokenValue] =
		React.useState<string>("0");
	const [exchangeTokenValue, setExchangeTokenValue] =
		React.useState<string>("0");
	const [estimatedFee, setEstimatedFee] = useState<string>();
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();
	const { api }: any = useCENNZApi();
	const assets = useAssets();
	const {
		wallet,
		selectedAccount,
		balances,
		connectWallet,
		fetchAssetBalances,
	} = useWallet();
	const signer = wallet?.signer;
	const { web3Enable } = useDappModule();

	useEffect(() => {
		if (!wallet) {
			connectWallet();
		}
	}, [web3Enable, api]);

	useEffect(() => {
		const setReceivedTokenAmount = async () => {
			try {
				if (
					parseInt(exchangeTokenValue) > 0 &&
					api &&
					exchangeToken &&
					receivedToken
				) {
					setError(undefined);
					setSuccess(undefined);
					let exchangeAmount: any = new BigNumber(
						exchangeTokenValue.toString()
					);
					exchangeAmount = exchangeAmount
						.multipliedBy(Math.pow(10, exchangeToken.decimals))
						.toString(10);

					//check if they own enough tokens to exchange
					const exchangeTokenBalance = balances.find(
						(token) => token.id === exchangeToken.id
					);
					if (parseInt(exchangeTokenValue) > exchangeTokenBalance.value) {
						throw new Error("Account Balance is too low");
					}
					const sellPrice = await (api.rpc as any).cennzx.sellPrice(
						exchangeToken.id,
						exchangeAmount,
						receivedToken.id
					);
					let receivedAmount: any = new Amount(
						sellPrice.price.toString(),
						AmountUnit.UN
					);
					receivedAmount = receivedAmount.toAmount(receivedToken.decimals);
					setReceivedTokenValue(receivedAmount.toString());
					const estimatedFee = await getEstimatedTransactionFee(
						exchangeAmount,
						exchangeToken.id,
						receivedToken.id
					);
					setEstimatedFee(estimatedFee);
				}
			} catch (e) {
				setError(e.message);
			}
		};
		setReceivedTokenAmount();
	}, [api, exchangeTokenValue, assets, exchangeToken, receivedToken]);

	const getEstimatedTransactionFee = async (
		exchangeAmount: string,
		exchangeTokenId: number,
		receivedTokenId: number
	) => {
		//TODO calculate slippage here
		const maxAmount = parseInt(exchangeAmount) * 2;
		const extrinsic = api.tx.cennzx.buyAsset(
			null,
			exchangeTokenId,
			receivedTokenId,
			exchangeAmount,
			maxAmount
		);
		const assetIds =
			process.env.NEXT_PUBLIC_SUPPORTED_ASSETS &&
			process.env.NEXT_PUBLIC_SUPPORTED_ASSETS.split(",");

		const feeFromQuery = await api.derive.fees.estimateFee({
			extrinsic,
			userFeeAssetId: assetIds[1],
		});
		let estimatedFee: any = new Amount(feeFromQuery.toString(), AmountUnit.UN);
		const CPAY_DECIMALS = 4;
		estimatedFee = estimatedFee.toAmount(CPAY_DECIMALS);
		return estimatedFee.toString();
	};

	const exchangeTokens = useCallback(async () => {
		if (!signer) return;
		try {
			if (
				parseInt(receivedTokenValue) > 0 &&
				api &&
				exchangeToken &&
				receivedToken
			) {
				let exchangeAmount: any = new BigNumber(exchangeTokenValue.toString());
				exchangeAmount = exchangeAmount
					.multipliedBy(Math.pow(10, exchangeToken.decimals))
					.toString(10);
				const maxAmount = parseInt(exchangeAmount) * 2;
				let buyAmount: any = new BigNumber(receivedTokenValue);
				buyAmount = buyAmount
					.multipliedBy(Math.pow(10, receivedToken.decimals))
					.toString(10);
				const extrinsic = api.tx.cennzx.buyAsset(
					null,
					exchangeToken.id,
					receivedToken.id,
					buyAmount,
					maxAmount
				);
				extrinsic.signAndSend(
					selectedAccount.address,
					{ signer },
					async ({ status, events }: any) => {
						if (status.isInBlock && events !== undefined) {
							for (const { event } of events) {
								if (event.method === "AssetBought") {
									setError(undefined);
									setSuccess(`Successfully Swapped Tokens!`);
									fetchAssetBalances();
								}
							}
						}
					}
				);
			}
		} catch (e) {
			setError(e.message);
		}
	}, [signer, api, exchangeToken, receivedToken, receivedTokenValue]);

	return (
		<div className={styles.swapContainer}>
			<h1 className={styles.pageHeader}>SWAP</h1>
			<div className={styles.tokenPickerContainer}>
				<p className={styles.secondaryText}>YOU SEND</p>
				<TokenPicker
					setToken={setExchangeToken}
					setAmount={setExchangeTokenValue}
					amount={exchangeTokenValue}
					cennznet={true}
					forceSelection={exchangeToken}
					showBalance={true}
					error={error}
					success={success}
				/>
			</div>
			<ExchangeIcon
				onClick={() => {
					setReceivedToken(exchangeToken);
					setExchangeToken(receivedToken);
					setExchangeTokenValue(receivedTokenValue);
					setReceivedTokenValue(exchangeTokenValue);
				}}
			/>
			<div className={styles.tokenPickerContainer}>
				<p className={styles.thirdText}>YOU GET</p>
				<TokenPicker
					setToken={setReceivedToken}
					setAmount={setReceivedTokenValue}
					amount={receivedTokenValue}
					cennznet={true}
					forceSelection={receivedToken}
					removeToken={exchangeToken}
				/>
			</div>
			{estimatedFee && <p>Transaction fee (estimated): {estimatedFee} CPAY</p>}
			<Button
				sx={{
					fontFamily: "Teko",
					fontWeight: "bold",
					fontSize: "21px",
					lineHeight: "124%",
					color: "#1130FF",
					mt: "20px",
					mb: "50px",
				}}
				size="large"
				variant="outlined"
				onClick={exchangeTokens}
				disabled={!signer}
			>
				{!!signer ? "Swap" : "Connect Wallet"}
			</Button>
		</div>
	);
};

export default Exchange;
