import { Api } from "@cennznet/api";
import { CENNZAsset } from "@/types";
import fetchSwapAssets from "@/utils/fetchSwapAssets";
import { css } from "@emotion/react";
import { Theme } from "@mui/material";
import useTokensFetcher from "@/hooks/useTokensFetcher";
import TokenInput from "@/components/shared/TokenInput";
import useTokenInput from "@/hooks/useTokenInput";
import { useCallback, useEffect, useState } from "react";
import ExchangeIcon from "@/components/shared/ExchangeIcon";
import ThreeDots from "@/components/shared/ThreeDots";
import { useCENNZWallet } from "@/providers/CENNZWalletProvider";
import { formatBalance } from "@/utils";

export async function getStaticProps() {
	const api = await Api.create({ provider: process.env.NEXT_PUBLIC_API_URL });

	return {
		props: {
			defaultAssets: await fetchSwapAssets(api),
		},
	};
}

const Swap: React.FC<{ defaultAssets: CENNZAsset[] }> = ({ defaultAssets }) => {
	const { selectedAccount, balances } = useCENNZWallet();

	const [sendTokens] = useTokensFetcher<CENNZAsset[]>(
		fetchSwapAssets,
		defaultAssets
	);

	const [receiveTokens, setReceiveTokens] = useState<CENNZAsset[]>(sendTokens);

	const cpayAsset = sendTokens?.find((token) => token.symbol === "CPAY");
	const cennzAsset = sendTokens?.find((token) => token.symbol === "CENNZ");

	const [sendToken, sendValue] = useTokenInput(cennzAsset.assetId, Number);
	const [receiveToken, receiveValue] = useTokenInput(cpayAsset.assetId, Number);

	const onExchangeIconClick = useCallback(() => {
		const setTokenId = sendToken.setTokenId;
		setTokenId(receiveToken.tokenId);
	}, [receiveToken.tokenId, sendToken.setTokenId]);

	// Sync up tokens for receive input
	useEffect(() => {
		const receiveTokens = sendTokens.filter(
			(token) => token.assetId !== sendToken.tokenId
		);
		const setTokenId = receiveToken.setTokenId;

		setTokenId((currentTokenId) => {
			const token = receiveTokens.find(
				(token) => token.assetId === currentTokenId
			);
			if (token) return currentTokenId;
			return receiveTokens[0].assetId;
		});

		setReceiveTokens(receiveTokens);
	}, [sendTokens, sendToken.tokenId, receiveToken.setTokenId]);

	const [sendBalance, setSendBalance] = useState<number>(null);
	const [receiveBalance, setReceiveBalance] = useState<number>(null);

	// Update asset balances for both send and receive assets
	useEffect(() => {
		if (!balances?.length) {
			setSendBalance(null);
			setReceiveBalance(null);
			return;
		}

		const sendBalance = balances.find(
			(balance) => balance.assetId === sendToken.tokenId
		);

		const receiveBalance = balances.find(
			(balance) => balance.assetId === receiveToken.tokenId
		);

		setSendBalance(sendBalance.value);
		setReceiveBalance(receiveBalance.value);
	}, [balances, sendToken.tokenId, receiveToken.tokenId]);

	// Reset the send value when changing send token
	useEffect(() => {
		if (sendBalance === null) return;
		const setValue = sendValue.setValue;

		setValue((currentRawValue) => {
			const currentValue = Number(currentRawValue);
			if (currentRawValue === "" || currentValue <= sendBalance)
				return currentRawValue;
			return "";
		});
	}, [sendBalance, sendValue.setValue]);

	return (
		<div css={styles.root}>
			<h1 css={styles.heading}>SWAP</h1>
			<form css={styles.form}>
				<div css={styles.formField}>
					<label>You Send</label>
					<TokenInput
						onMaxValueRequest={
							!!sendBalance
								? () => sendValue.setValue(formatBalance(sendBalance))
								: null
						}
						selectedTokenId={sendToken.tokenId}
						onTokenChange={sendToken.onTokenChange}
						value={sendValue.value}
						onChange={sendValue.onValueChange}
						tokens={sendTokens}
					/>

					{!!selectedAccount && (
						<div css={styles.tokenBalance}>
							Balance:{" "}
							{sendBalance !== null ? (
								formatBalance(sendBalance)
							) : (
								<ThreeDots />
							)}
						</div>
					)}
				</div>

				<div css={styles.formField}>
					<ExchangeIcon onClick={onExchangeIconClick} />
				</div>

				<div css={styles.formField}>
					<label>You Get</label>
					<TokenInput
						selectedTokenId={receiveToken.tokenId}
						onTokenChange={receiveToken.onTokenChange}
						value={receiveValue.value}
						onChange={receiveValue.onValueChange}
						tokens={receiveTokens}
					/>
					{!!selectedAccount && (
						<div css={styles.tokenBalance}>
							Balance:{" "}
							{receiveBalance !== null ? (
								formatBalance(receiveBalance)
							) : (
								<ThreeDots />
							)}
						</div>
					)}
				</div>
			</form>
		</div>
	);
};

export default Swap;

const styles = {
	root: css`
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
		padding: 1.5em 2.5em 2.5em;
	`,

	heading: ({ palette }: Theme) => css`
		font-weight: bold;
		font-size: 20px;
		line-height: 1;
		text-align: center;
		text-transform: uppercase;
		color: ${palette.primary.main};
	`,

	form: css`
		width: 100%;
		margin-top: 1.5em;
	`,

	formField: css`
		margin-bottom: 2em;

		label {
			font-weight: bold;
			font-size: 0.875em;
			text-transform: uppercase;
			margin-bottom: 0.5em;
			display: block;
		}
	`,

	tokenBalance: css`
		margin-top: 0.5em;
		font-weight: 500;
	`,
};
