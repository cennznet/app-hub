import React, { useEffect, useState, useCallback } from "react";
import TokenPicker from "@/components/shared/TokenPicker";
import ExchangeIcon from "@/components/shared/ExchangeIcon";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { CENNZAsset } from "@/types";
import { css } from "@emotion/react";

import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { fetchSwapAssets } from "@/utils";
import {
	fetchEstimatedTransactionFee,
	fetchExchangeExtrinsic,
	fetchExchangeRate,
	fetchTokenAmounts,
} from "@/utils/swap";
import ConnectWalletButton from "@/components/shared/ConnectWalletButton";
import Settings from "@/components/pool/Settings";
import generateGlobalProps from "@/utils/generateGlobalProps";
import { useGlobalModal } from "@/providers/GlobalModalProvider";

export async function getStaticProps() {
	return {
		props: {
			...(await generateGlobalProps()),
		},
	};
}

const Exchange: React.FC<{}> = () => {
	const [assets, setAssets] = useState<CENNZAsset[]>();
	const [exchangeToken, setExchangeToken] = useState<CENNZAsset>();
	const [receivedToken, setReceivedToken] = useState<CENNZAsset>();
	const [receivedTokenValue, setReceivedTokenValue] = React.useState<string>();
	const [exchangeTokenValue, setExchangeTokenValue] = React.useState<string>();
	const [estimatedFee, setEstimatedFee] = useState<string>();
	const [exchangeRate, setExchangeRate] = useState<number>();
	const [slippage, setSlippage] = useState<number>(5);
	const [error, setError] = useState<string>();
	const [success, setSuccess] = useState<string>();
	const { api } = useCENNZApi();
	const { balances, updateBalances, wallet, selectedAccount } =
		useCENNZWallet();
	const signer = wallet?.signer;
	const { showDialog } = useGlobalModal();

	useEffect(() => {
		if (!api || assets) return;
		(async () => setAssets(await fetchSwapAssets(api)))();
	}, [api, assets]);

	useEffect(() => {
		setError(undefined);
		setSuccess(undefined);
		if (
			parseInt(exchangeTokenValue) <= 0 ||
			!api ||
			!exchangeToken ||
			!receivedToken ||
			!balances ||
			!exchangeTokenValue ||
			!assets
		)
			return;

		(async () => {
			try {
				const { exchangeAmount, receivedAmount } = await fetchTokenAmounts(
					api,
					exchangeToken,
					exchangeTokenValue,
					balances,
					receivedToken
				);
				setReceivedTokenValue(receivedAmount.toString());
				const estimatedExchangeRate = await fetchExchangeRate(
					api,
					exchangeToken,
					receivedToken
				);
				setExchangeRate(estimatedExchangeRate);
				const estimatedFee = await fetchEstimatedTransactionFee(
					api,
					exchangeAmount,
					exchangeToken.assetId,
					receivedToken.assetId,
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
			await showDialog({
				title: "Swap in Progress",
				message: "Please sign transaction to continue with the token swap.",
				loading: true,
			});

			extrinsic.signAndSend(
				selectedAccount.address,
				{ signer },
				async ({ status, events }: any) => {
					if (status.isInBlock && events !== undefined) {
						for (const { event } of events) {
							if (event.method === "AssetBought") {
								setError(undefined);
								await showDialog({
									title: "Transaction Successfully Completed!",
									message: `Successfully Swapped ${exchangeTokenValue} ${exchangeToken.symbol} for ${receivedTokenValue} ${receivedToken.symbol}!`,
								});
								updateBalances();
							}
						}
					}
				}
			);
		} catch (e) {
			await showDialog({
				title: "Error Occurred",
				message: e.message,
			});
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
		showDialog,
	]);

	return (
		<div css={styles.swapContainer}>
			<h1 css={styles.pageHeader}>SWAP</h1>
			<div css={styles.tokenPickerContainer}>
				<p css={styles.secondaryText}>YOU SEND</p>
				<TokenPicker
					assets={assets}
					setToken={setExchangeToken}
					setAmount={setExchangeTokenValue}
					amount={exchangeTokenValue}
					forceSelection={exchangeToken}
					showBalance={true}
					error={error}
					success={success}
				/>
			</div>
			<div css={styles.exchangeIconContainer}>
				<ExchangeIcon
					onClick={() => {
						setReceivedToken(exchangeToken);
						setExchangeToken(receivedToken);
						setExchangeTokenValue(receivedTokenValue);
						setReceivedTokenValue(exchangeTokenValue);
					}}
				/>
			</div>
			<div css={styles.tokenPickerContainer}>
				<p css={styles.thirdText}>YOU GET</p>
				<TokenPicker
					assets={assets}
					setToken={setReceivedToken}
					setAmount={setReceivedTokenValue}
					amount={receivedTokenValue}
					forceSelection={receivedToken}
					removeToken={exchangeToken}
				/>
			</div>
			{estimatedFee && (
				<div css={styles.infoBoxContainer}>
					<div css={styles.infoBoxText}>
						<div css={styles.feeContainer}>
							<p>{"Exchange rates:"}</p>
							<span>{`1 ${exchangeToken.symbol} = ${exchangeRate} ${receivedToken.symbol}`}</span>
						</div>
						<div css={styles.feeContainer}>
							<p>{"Transaction fee (estimated):"}</p>
							<span>{estimatedFee + " CPAY"}</span>
						</div>
					</div>
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

export const styles = {
	swapContainer: css`
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 550px;
		border-radius: 4px;
		margin: 0 auto 5em;
		position: relative;
		background-color: #ffffff;
		box-shadow: 4px 8px 8px rgba(17, 48, 255, 0.1);
	`,
	pageHeader: css`
		font-family: "Roboto";
		font-style: normal;
		font-weight: bold;
		font-size: 20px;
		line-height: 125%;
		text-align: center;
		letter-spacing: 1.12428px;
		text-transform: uppercase;
		color: #1130ff;
		padding-top: 26px;
	`,
	secondaryText: css`
		font-family: "Roboto";
		font-style: normal;
		font-weight: bold;
		font-size: 14px;
		line-height: 125%;
		letter-spacing: 1.12428px;
		text-transform: uppercase;
		color: #020202;
		margin-bottom: 27px;
	`,
	thirdText: css`
		font-family: "Roboto";
		font-style: normal;
		font-weight: bold;
		font-size: 14px;
		line-height: 125%;
		letter-spacing: 1.12428px;
		text-transform: uppercase;
		color: #020202;
		margin: 0px;
		margin-bottom: -20px;
	`,
	tokenPickerContainer: css`
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	`,
	infoBoxContainer: css`
		width: 460px;
		height: 95px;
		min-height: 95px;
		background: #f5f6ff;
		padding: 24px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	`,
	infoBoxText: css`
		font-style: normal;
		font-weight: 600;
		font-size: 16px;
		line-height: 150%;
		color: #020202;
		text-align: left;
	`,
	feeContainer: css`
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		p {
			color: #1130ff;
			margin: 0px 5px 3px 0px;
		}
		span {
			font-weight: normal;
		}
	`,
	exchangeIconContainer: css`
		margin-top: -27px;
		margin-bottom: 8px;
	`,
};
