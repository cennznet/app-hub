import { Api } from "@cennznet/api";
import BigNumber from "bignumber.js";
import { Amount, AmountUnit } from "@/utils/Amount";
import {
	fetchEstimatedTransactionFee,
	fetchExchangeExtrinsic,
	fetchTokenAmounts,
} from "@/utils/swap";

const assets = {
	CENNZ: { id: 16000, symbol: "CENNZ", decimals: 4, logo: "/images/cennz.svg" },
	CPAY: { id: 16001, symbol: "CPAY", decimals: 4, logo: "/images/cpay.svg" },
};
const balances = [
	{
		id: 16000,
		symbol: "CENNZ",
		decimals: 4,
		logo: "/images/cennz.svg",
		value: 5000,
	},
	{
		id: 16001,
		symbol: "CPAY",
		decimals: 4,
		logo: "/images/cpay.svg",
		value: 5000,
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

		let expectedExchangeAmount: any = new BigNumber(
			exchangeTokenValue.toString()
		);
		expectedExchangeAmount = expectedExchangeAmount
			.multipliedBy(Math.pow(10, exchangeToken.decimals))
			.toString(10);
		const sellPrice = await api.rpc.cennzx.sellPrice(
			exchangeToken.id,
			exchangeAmount,
			receivedToken.id
		);
		let expectedReceivedAmount: any = new Amount(
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

describe("fetchEstimatedTransactionFee", () => {
	it("estimates fee", async () => {
		let exchangeAmount: any = new BigNumber("100");
		exchangeAmount = exchangeAmount
			.multipliedBy(Math.pow(10, assets.CENNZ.decimals))
			.toString(10);
		const exchangeTokenId = assets.CENNZ.id;
		const receivedTokenId = assets.CPAY.id;
		const estimatedFee = await fetchEstimatedTransactionFee(
			api,
			exchangeAmount,
			exchangeTokenId,
			receivedTokenId
		);

		const maxAmount = parseInt(exchangeAmount) * 2;
		const extrinsic = api.tx.cennzx.buyAsset(
			null,
			exchangeTokenId,
			receivedTokenId,
			exchangeAmount,
			maxAmount
		);
		const feeFromQuery = await api.derive.fees.estimateFee({
			extrinsic,
			userFeeAssetId: assets.CPAY.id,
		});
		let expectedEstimatedFee: any = new Amount(
			feeFromQuery.toString(),
			AmountUnit.UN
		);
		expectedEstimatedFee = expectedEstimatedFee.toAmount(assets.CPAY.decimals);

		expect(estimatedFee).toEqual(expectedEstimatedFee.toString());
	});
});

describe("fetchExchangeExtrinsic", () => {
	it("returns extrinsic", async () => {
		const exchangeToken = assets.CENNZ;
		const receivedToken = assets.CPAY;
		const { exchangeAmount, receivedAmount } = await fetchTokenAmounts(
			api,
			exchangeToken,
			"100",
			balances,
			receivedToken
		);
		const extrinsic = await fetchExchangeExtrinsic(
			api,
			exchangeToken,
			exchangeAmount,
			receivedToken,
			receivedAmount
		);

		let buyAmount: any = new BigNumber(receivedAmount.toString());
		buyAmount = buyAmount
			.multipliedBy(Math.pow(10, receivedToken.decimals))
			.toString(10);

		const maxAmount = parseInt(exchangeAmount) * 2;

		const expectedExtrinsic = await api.tx.cennzx.buyAsset(
			null,
			exchangeToken.id,
			receivedToken.id,
			buyAmount,
			maxAmount
		);

		expect(extrinsic).toEqual(expectedExtrinsic);
	});
});
