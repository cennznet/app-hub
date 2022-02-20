import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@mui/material";
import TokenPicker from "@/components/shared/TokenPicker";
import ExchangeIcon from "@/components/shared/ExchangeIcon";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { useAssets } from "@/providers/SupportedAssetsProvider";
import { Asset } from "@/types";

import styles from "@/styles/components/swap/swap.module.css";
import { useWallet } from "@/providers/SupportedWalletProvider";
import { useCENNZExtension } from "@/providers/CENNZExtensionProvider";
import {
	fetchEstimatedTransactionFee,
	fetchExchangeExtrinsic,
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
	const [receivedTokenValue, setReceivedTokenValue] =
		React.useState<string>("0");
	const [exchangeTokenValue, setExchangeTokenValue] =
		React.useState<string>("0");
	const [estimatedFee, setEstimatedFee] = useState<string>();
	const [slippage, setSlippage] = useState<number>(5);
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
	const { web3Enable } = useCENNZExtension();

	useEffect(() => {
		if (!wallet) {
			connectWallet();
		}
	}, [web3Enable, api]);

	useEffect(() => {
		(async () => {
			if (
				parseFloat(exchangeTokenValue) <= 0 ||
				!api ||
				!exchangeToken ||
				!receivedToken ||
				!balances
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
				console.info("error here..");
				setError(e.message);
			}
		})();
	}, [api, exchangeTokenValue, assets, exchangeToken, receivedToken, balances]);

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
								fetchAssetBalances();
							}
						}
					}
				}
			);
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
			{estimatedFee && (
				<div className={styles.infoBoxContainer}>
					<p className={styles.infoBoxText}>
						<div className={styles.feeContainer}>
							<p>{"Exchange rate:"}</p>
							{/*TODO Get calculation for this*/}
							<span>{"1 CENNZ = 43.2166 CPAY"}</span>
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
