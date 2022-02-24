import React, { useEffect, useState, useCallback } from "react";
import TokenPicker from "@/components/shared/TokenPicker";
import ExchangeIcon from "@/components/shared/ExchangeIcon";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useAssets } from "@/providers/SupportedAssetsProvider";
import { Asset } from "@/types";

import styles from "@/styles/pages/swap.module.css";
import { useWallet } from "@/providers/SupportedWalletProvider";
import {
	fetchEstimatedTransactionFee,
	fetchExchangeExtrinsic,
	fetchExchangeRate,
	fetchTokenAmounts,
} from "@/utils/swap";
import ConnectWalletButton from "@/components/shared/ConnectWalletButton";
import Settings from "@/components/pool/Settings";
import generateGlobalProps from "@/utils/generateGlobalProps";

export async function getStaticProps() {
	return {
		props: {
			...(await generateGlobalProps()),
		},
	};
}

const Exchange: React.FC<{}> = () => {
	const [exchangeToken, setExchangeToken] = useState<Asset>();
	const [receivedToken, setReceivedToken] = useState<Asset>();
	const [receivedTokenValue, setReceivedTokenValue] = React.useState<string>();
	const [exchangeTokenValue, setExchangeTokenValue] = React.useState<string>();
	const [estimatedFee, setEstimatedFee] = useState<string>();
	const [exchangeRate, setExchangeRate] = useState<number>();
	const [slippage, setSlippage] = useState<number>(5);
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();
	const { api }: any = useCENNZApi();
	const assets = useAssets();
	const { balances, updateBalances, wallet, selectedAccount } = useWallet();
	const signer = wallet?.signer;

	useEffect(() => {
		setError(undefined);
		setSuccess(undefined);
		(async () => {
			if (
				parseInt(exchangeTokenValue) <= 0 ||
				!api ||
				!exchangeToken ||
				!receivedToken ||
				!balances ||
				!exchangeTokenValue
			)
				return;

			try {
				setError(undefined);
				setSuccess(undefined);

				const { exchangeAmount, receivedAmount } = await fetchTokenAmounts(
					api,
					exchangeToken,
					exchangeTokenValue,
					balances,
					receivedToken
				);
				setReceivedTokenValue(receivedAmount.toString());
				const estimatedFee = await fetchEstimatedTransactionFee(
					api,
					exchangeAmount,
					exchangeToken.id,
					receivedToken.id,
					slippage
				);
				setEstimatedFee(estimatedFee);
			} catch (e) {
				setError(e.message);
			}
		})();
	}, [
		api,
		exchangeTokenValue,
		assets,
		exchangeToken,
		receivedToken,
		balances,
		slippage,
	]);

	useEffect(() => {
		if (!api || !exchangeToken || !receivedToken) return;
		(async () => {
			try {
				const estimatedExchangeRate = await fetchExchangeRate(
					api,
					exchangeToken,
					receivedToken
				);
				setExchangeRate(estimatedExchangeRate);
			} catch (e) {
				setError(e.message);
			}
		})();
	}, [exchangeToken, receivedToken, api]);

	const exchangeTokens = useCallback(async () => {
		if (
			parseFloat(receivedTokenValue) <= 0 ||
			!api ||
			!exchangeToken ||
			!receivedToken ||
			!signer
		)
			return;

		try {
			const extrinsic = await fetchExchangeExtrinsic(
				api,
				exchangeToken,
				exchangeTokenValue,
				receivedToken,
				receivedTokenValue,
				slippage
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
								updateBalances();
							}
						}
					}
				}
			);
		} catch (e) {
			setError(e.message);
		}
	}, [
		signer,
		api,
		exchangeToken,
		exchangeTokenValue,
		receivedToken,
		receivedTokenValue,
		updateBalances,
		selectedAccount,
		slippage,
	]);

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
			<div className={styles.exchangeIconContainer}>
				<ExchangeIcon
					onClick={() => {
						setReceivedToken(exchangeToken);
						setExchangeToken(receivedToken);
						setExchangeTokenValue(receivedTokenValue);
						setReceivedTokenValue(exchangeTokenValue);
					}}
				/>
			</div>
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
			{estimatedFee && (
				<div className={styles.infoBoxContainer}>
					<p className={styles.infoBoxText}>
						<div className={styles.feeContainer}>
							<p>{"Exchange rates:"}</p>
							<span>{`1 ${exchangeToken.symbol} = ${exchangeRate} ${receivedToken.symbol}`}</span>
						</div>
						<div className={styles.feeContainer}>
							<p>{"Transaction fee (estimated):"}</p>
							<span>{estimatedFee + " CPAY"}</span>
						</div>
					</p>
				</div>
			)}
			<Settings
				slippage={slippage}
				setSlippage={setSlippage}
				coreAmount={exchangeTokenValue}
				tokenName={exchangeToken?.symbol}
				color={"#f5f6ff"}
			/>
			<ConnectWalletButton
				onClick={exchangeTokens}
				buttonText={"SWAP"}
				requireMetamask={false}
				requireCennznet={true}
				width={89}
			/>
		</div>
	);
};

export default Exchange;
