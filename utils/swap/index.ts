import { Api } from "@cennznet/api";
import { Amount, AmountUnit } from "@/utils/Amount";
import BigNumber from "bignumber.js";
import { CENNZAsset } from "@/types";
import { CENNZAssetBalance } from "@/types";

const CPAY = {
	id: 16001,
	symbol: "CPAY",
	decimals: 4,
	logo: "/images/cpay.svg",
};

// NOTE: Moved to `@/utils/fetchSwapExchangeRate`
// export const fetchExchangeRate = async (
// 	api: Api,
// 	exchangeToken: CENNZAsset,
// 	receivedToken: CENNZAsset
// ): Promise<number> => {
// 	const { price } = await (api.rpc as any).cennzx.sellPrice(
// 		exchangeToken.assetId,
// 		(1 * Math.pow(10, exchangeToken.decimals)).toString(),
// 		receivedToken.assetId
// 	);

// 	return price.toJSON() / Math.pow(10, receivedToken.decimals);
// };

export const fetchTokenAmounts = async (
	api: Api,
	exchangeToken: CENNZAsset,
	exchangeTokenValue: string,
	balances: CENNZAssetBalance[],
	receivedToken: CENNZAsset
) => {
	let exchangeAmount: any = new BigNumber(exchangeTokenValue.toString());
	exchangeAmount = exchangeAmount
		.multipliedBy(Math.pow(10, exchangeToken.decimals))
		.toString(10);

	//check if they own enough tokens to exchange
	const exchangeTokenBalance = balances.find(
		(token) => token.assetId === exchangeToken.assetId
	);
	if (parseFloat(exchangeTokenValue) > exchangeTokenBalance.value) {
		throw new Error("Account balance is too low");
	}

	const sellPrice = await (api.rpc as any).cennzx.sellPrice(
		exchangeToken.assetId,
		exchangeAmount,
		receivedToken.assetId
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
	const maxAmount = new Amount(
		parseFloat(exchangeAmount) + parseFloat(exchangeAmount) * (slippage / 100)
	).toString();
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
	exchangeToken: CENNZAsset,
	exchangeTokenValue: string,
	receivedToken: CENNZAsset,
	receivedTokenValue: string,
	slippage: number
) => {
	let exchangeAmount: any = new BigNumber(exchangeTokenValue.toString());
	exchangeAmount = exchangeAmount
		.multipliedBy(Math.pow(10, exchangeToken.decimals))
		.toString(10);
	const maxAmount = new Amount(
		parseFloat(exchangeAmount) + parseFloat(exchangeAmount) * (slippage / 100)
	).toString();
	let buyAmount: any = new BigNumber(receivedTokenValue);
	buyAmount = buyAmount
		.multipliedBy(Math.pow(10, receivedToken.decimals))
		.toString(10);

	return api.tx.cennzx.buyAsset(
		null,
		exchangeToken.assetId,
		receivedToken.assetId,
		buyAmount,
		maxAmount
	);
};
