import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Box, Button, TextField } from "@mui/material";
import TokenPicker from "../../components/shared/TokenPicker";
import ExchangeIcon from "../../components/swap/ExchangeIcon";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import { useAssets } from "../../providers/SupportedAssetsProvider";
import { Amount, AmountUnit } from "../../utils/Amount";
import { Asset } from "../../types";
import BigNumber from "bignumber.js";

import styles from "../../styles/exchange.module.css";
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
	const { api, initApi }: any = useCENNZApi();
	const assets = useAssets();
	const { wallet, selectedAccount, balances, connectWallet } = useWallet();
	const signer = useMemo(() => wallet?.signer, [wallet]);
	const { web3Enable } = useDappModule();

	useEffect(() => {
		if (!wallet) {
			connectWallet();
		}
	}, [web3Enable, api]);

	useEffect(() => {
		if (!api?.isConnected) {
			initApi();
		}
	}, [api, initApi]);

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
						throw new Error("Account Balance is too low.");
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
		<Box
			sx={{
				position: "absolute",
				top: "25%",
				left: "calc(50% - 552px/2)",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Button
				style={{
					position: "absolute",
					top: "-5%",
					width: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#FFFFFF",
					border: "4px solid #1130FF",
					flex: "none",
					order: 0,
					alignSelf: "stretch",
					flexGrow: 1,
					margin: "0px 0px",
					borderBottom: "none",
					fontFamily: "Teko",
					fontWeight: "bold",
					fontSize: "24px",
					lineHeight: "124%",
					color: "#1130FF",
				}}
			>
				Swap
			</Button>
			<Box
				component="form"
				sx={{
					width: "552px",
					height: "auto",
					margin: "0 auto",
					background: "#FFFFFF",
					border: "4px solid #1130FF",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					padding: "0px",
				}}
			>
				<TokenPicker
					setToken={setExchangeToken}
					setAmount={setExchangeTokenValue}
					amount={exchangeTokenValue}
					cennznet={true}
					forceSelection={exchangeToken}
				/>
				{error && <p className={styles.errorMsg}>{error}</p>}
				{success && <p className={styles.successMsg}>{success}</p>}
				<ExchangeIcon
					onClick={() => {
						setReceivedToken(exchangeToken);
						setExchangeToken(receivedToken);
						setExchangeTokenValue(receivedTokenValue);
						setReceivedTokenValue(exchangeTokenValue);
					}}
				/>
				<TokenPicker
					setToken={setReceivedToken}
					setAmount={setReceivedTokenValue}
					amount={receivedTokenValue}
					cennznet={true}
					forceSelection={receivedToken}
					removeToken={exchangeToken}
				/>
				{estimatedFee && (
					<p>Transaction fee (estimated): {estimatedFee} CPAY</p>
				)}
				<Button
					sx={{
						fontFamily: "Teko",
						fontWeight: "bold",
						fontSize: "21px",
						lineHeight: "124%",
						color: "#1130FF",
						mt: "30px",
						mb: "50px",
					}}
					size="large"
					variant="outlined"
					onClick={exchangeTokens}
					disabled={!signer}
				>
					{!!signer ? "Exchange" : "Connect Wallet"}
				</Button>
			</Box>
		</Box>
	);
};

export default Exchange;
