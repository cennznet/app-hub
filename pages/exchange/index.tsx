import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import TokenPicker from "../../components/shared/TokenPicker";
import ExchangeIcon from "../../components/exchange/ExchangeIcon";
import { useCENNZApi } from "../../providers/CENNZApiProvider";
import SupportedAssetsProvider, {
	useAssets,
} from "../../providers/SupportedAssetsProvider";
import { Amount, AmountUnit } from "../../utils/exchange/Amount";
import { Asset } from "../../types/exchange";
import BigNumber from "bignumber.js";

const Exchange: React.FC<{}> = () => {
	const [exchangeToken, setExchangeToken] = useState<Asset>();
	const [receivedToken, setReceivedToken] = useState<Asset>();
	const [receivedTokenValue, setReceivedTokenValue] =
		React.useState<string>("0");
	const [exchangeTokenValue, setExchangeTokenValue] =
		React.useState<string>("0");
	const [estimatedFee, setEstimatedFee] = useState<string>();
	const { api, apiRx, initApi, initApiRx }: any = useCENNZApi();
	const assets = useAssets();

	useEffect(() => {
		if (!api?.isConnected) {
			initApi();
		}
	}, [api, initApi]);

	useEffect(() => {
		const setReceivedTokenAmount = async () => {
			if (
				parseInt(exchangeTokenValue) > 0 &&
				api &&
				exchangeToken &&
				receivedToken
			) {
				let exchangeAmount: any = new BigNumber(exchangeTokenValue.toString());
				exchangeAmount = exchangeAmount
					.multipliedBy(Math.pow(10, exchangeToken.decimals))
					.toString(10);
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
				setReceivedTokenValue(receivedAmount);
				const estimatedFee = await getEstimatedTransactionFee(
					exchangeAmount,
					exchangeToken.id,
					receivedToken.id
				);
				setEstimatedFee(estimatedFee);
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
		console.info(api.network);
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

	return (
		<SupportedAssetsProvider>
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
					Swap Tokens
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
						cennznet={true}
						forceSelection={exchangeToken}
					/>
					<TextField
						label="Amount"
						variant="outlined"
						required
						sx={{
							width: "80%",
							m: "30px 0 30px",
						}}
						value={exchangeTokenValue}
						onChange={(event) => setExchangeTokenValue(event.target.value)}
					/>
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
						cennznet={true}
						forceSelection={receivedToken}
						removeToken={exchangeToken}
					/>
					<TextField
						label="Amount"
						variant="outlined"
						required
						sx={{
							width: "80%",
							m: "30px 0 30px",
						}}
						value={receivedTokenValue}
						onChange={(event) => setReceivedTokenValue(event.target.value)}
					/>
					<p>Transaction fee (estimated): {estimatedFee} CPAY</p>
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
					>
						Exchange
					</Button>
				</Box>
			</Box>
		</SupportedAssetsProvider>
	);
};

export default Exchange;
