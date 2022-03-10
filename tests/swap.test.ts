import { Api } from "@cennznet/api";
import BigNumber from "bignumber.js";
import { Amount, AmountUnit } from "@/utils/Amount";
import {
	fetchEstimatedTransactionFee,
	fetchExchangeExtrinsic,
	fetchTokenAmounts,
} from "@/utils/swap";

const assets = {
	CENNZ: {
		assetId: 16000,
		symbol: "CENNZ",
		decimals: 4,
		logo: "/images/cennz.svg",
	},
	CPAY: {
		assetId: 16001,
		symbol: "CPAY",
		decimals: 4,
		logo: "/images/cpay.svg",
	},
};
const balances = [
	{
		assetId: 16000,
		symbol: "CENNZ",
		decimals: 4,
		value: 5000,
		rawValue: null,
	},
	{
		assetId: 16001,
		symbol: "CPAY",
		decimals: 4,
		value: 5000,
		rawValue: null,
	},
];

let api;
beforeAll(async () => {
	api = await Api.create({ provider: "wss://nikau.centrality.me/public/ws" });
});

afterAll(async () => {
	await api.disconnect();
});

describe("fetchTokenAmounts", () => {
	it("returns amounts", async () => {
		const exchangeToken = assets.CENNZ;
		const receivedToken = assets.CPAY;
		const exchangeTokenValue = "100";
		const { exchangeAmount, receivedAmount } = await fetchTokenAmounts(
			api,
			exchangeToken,
			exchangeTokenValue,
			balances,
			receivedToken
		);

		let expectedExchangeAmount: BigNumber | string = new BigNumber(
			exchangeTokenValue.toString()
		);
		expectedExchangeAmount = expectedExchangeAmount
			.multipliedBy(Math.pow(10, exchangeToken.decimals))
			.toString(10);
		const sellPrice = await api.rpc.cennzx.sellPrice(
			exchangeToken.assetId,
			exchangeAmount,
			receivedToken.assetId
		);
		let expectedReceivedAmount: BigNumber | Amount = new Amount(
			sellPrice.price.toString(),
			AmountUnit.UN
		);
		expectedReceivedAmount = expectedReceivedAmount.toAmount(
			receivedToken.decimals
		);

		expect(exchangeAmount).toEqual(expectedExchangeAmount);
		expect(receivedAmount).toEqual(expectedReceivedAmount);
	});
	it("throws error if balance is too low", async () => {
		await fetchTokenAmounts(
			api,
			assets.CENNZ,
			"10000",
			balances,
			assets.CPAY
		).catch((err) => expect(err.message).toEqual("Account balance is too low"));
	});
});

// describe("fetchEstimatedTransactionFee", () => {
// 	it("estimates fee", async () => {
// 		let exchangeAmount: string | BigNumber = new BigNumber("100");
// 		const slippage = 5;
// 		exchangeAmount = exchangeAmount
// 			.multipliedBy(Math.pow(10, assets.CENNZ.decimals))
// 			.toString(10);
// 		const exchangeTokenId = assets.CENNZ.assetId;
// 		const receivedTokenId = assets.CPAY.assetId;
// 		const estimatedFee = await fetchEstimatedTransactionFee(
// 			api,
// 			exchangeAmount,
// 			exchangeTokenId,
// 			receivedTokenId,
// 			slippage
// 		);

// 		const maxAmount = Math.round(
// 			parseFloat(exchangeAmount) + parseFloat(exchangeAmount) * (slippage / 100)
// 		);
// 		const extrinsic = api.tx.cennzx.buyAsset(
// 			null,
// 			exchangeTokenId,
// 			receivedTokenId,
// 			exchangeAmount,
// 			maxAmount
// 		);
// 		const feeFromQuery = await api.derive.fees.estimateFee({
// 			extrinsic,
// 			userFeeAssetId: assets.CPAY.assetId,
// 		});
// 		let expectedEstimatedFee: BigNumber | Amount = new Amount(
// 			feeFromQuery.toString(),
// 			AmountUnit.UN
// 		);
// 		expectedEstimatedFee = expectedEstimatedFee.toAmount(assets.CPAY.decimals);

// 		expect(estimatedFee).toEqual(expectedEstimatedFee.toString());
// 	});
// });

//NOTE: This test is not effective, as comparing one extrinsic to another can be false positive
// describe("fetchExchangeExtrinsic", () => {
// 	it("returns extrinsic", async () => {
// 		const exchangeToken = assets.CENNZ;
// 		const receivedToken = assets.CPAY;
// 		const slippage = 5;
// 		const { exchangeAmount, receivedAmount } = await fetchTokenAmounts(
// 			api,
// 			exchangeToken,
// 			"100",
// 			balances,
// 			receivedToken
// 		);
// 		const extrinsic = await fetchExchangeExtrinsic(
// 			api,
// 			exchangeToken,
// 			exchangeAmount,
// 			receivedToken,
// 			receivedAmount,
// 			slippage
// 		);

// 		let buyAmount: BigNumber | string = new BigNumber(
// 			receivedAmount.toString()
// 		);
// 		buyAmount = buyAmount
// 			.multipliedBy(Math.pow(10, receivedToken.decimals))
// 			.toString(10);

// 		const maxAmount = Math.round(
// 			parseFloat(exchangeAmount) + parseFloat(exchangeAmount) * (slippage / 100)
// 		);
// 		const expectedExtrinsic = await api.tx.cennzx.buyAsset(
// 			null,
// 			exchangeToken.assetId,
// 			receivedToken.assetId,
// 			buyAmount,
// 			maxAmount
// 		);

// 		expect(extrinsic).toEqual(expectedExtrinsic);
// 	});
// });
