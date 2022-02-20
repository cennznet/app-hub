import { Api } from "@cennznet/api";
import { Amount, AmountUnit } from "@/utils/Amount";
import BigNumber from "bignumber.js";
import { Asset } from "@/types";
import { BalanceInfo } from "@/providers/SupportedWalletProvider";

const CPAY = {
	id: 16001,
	symbol: "CPAY",
	decimals: 4,
	logo: "/images/cpay.svg",
};

export const fetchTokenAmounts = async (
	api: Api,
	exchangeToken: Asset,
	exchangeTokenValue: string,
	balances: BalanceInfo[],
	receivedToken: Asset
) => {
	let exchangeAmount: any = new BigNumber(exchangeTokenValue.toString());
	exchangeAmount = exchangeAmount
		.multipliedBy(Math.pow(10, exchangeToken.decimals))
		.toString(10);

	//check if they own enough tokens to exchange
	const exchangeTokenBalance = balances.find(
		(token) => token.id === exchangeToken.id
	);
	if (parseInt(exchangeTokenValue) > exchangeTokenBalance.value) {
		throw new Error("Account balance is too low");
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

	return { exchangeAmount, receivedAmount };
};

export const fetchEstimatedTransactionFee = async (
	api: Api,
	exchangeAmount: string,
	exchangeTokenId: number,
	receivedTokenId: number,
	slippage: number
) => {
	const maxAmount =
		parseFloat(exchangeAmount) + parseFloat(exchangeAmount) * (slippage / 100);
	const extrinsic = api.tx.cennzx.buyAsset(
		null,
		exchangeTokenId,
		receivedTokenId,
		exchangeAmount,
		maxAmount
	);
	const feeFromQuery = await api.derive.fees.estimateFee({
		extrinsic,
		userFeeAssetId: CPAY.id,
	});
	let estimatedFee: any = new Amount(feeFromQuery.toString(), AmountUnit.UN);
	estimatedFee = estimatedFee.toAmount(CPAY.decimals);
	return estimatedFee.toString();
};

export const fetchExchangeExtrinsic = async (
	api: Api,
	exchangeToken: Asset,
	exchangeTokenValue: string,
	receivedToken: Asset,
	receivedTokenValue: string,
	slippage: number
) => {
	let exchangeAmount: any = new BigNumber(exchangeTokenValue.toString());
	exchangeAmount = exchangeAmount
		.multipliedBy(Math.pow(10, exchangeToken.decimals))
		.toString(10);
	const maxAmount =
		parseFloat(exchangeAmount) + parseFloat(exchangeAmount) * (slippage / 100);
	let buyAmount: any = new BigNumber(receivedTokenValue);
	buyAmount = buyAmount
		.multipliedBy(Math.pow(10, receivedToken.decimals))
		.toString(10);

	return api.tx.cennzx.buyAsset(
		null,
		exchangeToken.id,
		receivedToken.id,
		buyAmount,
		maxAmount
	);
};
