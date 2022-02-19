import { Api } from "@cennznet/api";
import { Amount, AmountUnit } from "@/utils/Amount";
import {
	calculateValues,
	fetchAddLiquidityValues,
	fetchExchangePool,
	fetchFeeEstimate,
	fetchUserPoolShare,
	fetchWithdrawLiquidityValues,
} from "@/utils/pool";

const testingAddress = "5FbMzsoEpd2mt8eyKpKUxwJ5S9W7nJVJkCer2Jk7tvSpB1vF";
const assets = {
	CENNZ: { id: 16000, symbol: "CENNZ", decimals: 4, logo: "/images/cennz.svg" },
	CPAY: { id: 16001, symbol: "CPAY", decimals: 4, logo: "/images/cpay.svg" },
};

let api;
beforeAll(async () => {
	api = await Api.create({ provider: "wss://nikau.centrality.me/public/ws" });
});

let exchangePool, assetAmount, coreAmount;
beforeEach(async () => {
	exchangePool = await fetchExchangePool(api, assets.CENNZ.id);
	assetAmount = new Amount(1000);
	coreAmount = assetAmount
		.mul(exchangePool.coreAssetBalance)
		.div(exchangePool.assetBalance)
		.subn(1);
});

afterAll(async () => {
	await api.disconnect();
});

describe("fetchExchangePool", () => {
	it("returns exchange pool values for CENNZ", async () => {
		const CENNZ = assets.CENNZ.id;
		const { address, assetBalance, coreAssetBalance } = await fetchExchangePool(
			api,
			CENNZ
		);

		const exchangeAddress = await api.derive.cennzx.exchangeAddress(CENNZ);

		const expectedAssetBalance = new Amount(
			await api.derive.cennzx.poolAssetBalance(CENNZ)
		);

		const expectedCoreAssetBalance = new Amount(
			await api.derive.cennzx.poolCoreAssetBalance(CENNZ)
		);

		expect(address).toEqual(exchangeAddress);
		expect(assetBalance).toEqual(expectedAssetBalance);
		expect(coreAssetBalance).toEqual(expectedCoreAssetBalance);
	});
	it("amounts return 0 when assetId is not a registered asset", async () => {
		const { assetBalance, coreAssetBalance } = await fetchExchangePool(api, 0);

		expect(assetBalance.isZero());
		expect(coreAssetBalance.isZero());
	});
});

describe("fetchUserPoolShare", () => {
	it("returns user pool share", async () => {
		const { assetBalance, coreAssetBalance, liquidity } =
			await fetchUserPoolShare(api, testingAddress, assets.CENNZ.id);

		const liquidityValue = await api.rpc.cennzx.liquidityValue(
			testingAddress,
			assets.CENNZ.id
		);
		const userAssetShare = new Amount(liquidityValue.asset);
		const userCoreShare = new Amount(liquidityValue.core);
		const expectedLiquidity = new Amount(liquidityValue.liquidity);

		expect(assetBalance).toEqual(userAssetShare);
		expect(coreAssetBalance).toEqual(userCoreShare);
		expect(liquidity).toEqual(expectedLiquidity);
	});
	it("throws invalid address error", async () => {
		await fetchUserPoolShare(
			api,
			"5FbMzsoEpd2mt8eyfakeAddress7nJVJkCer2Jk7tvSpB1vF",
			assets.CENNZ.id
		).catch((err) => expect(err.message).toContain("Invalid decoded address"));
	});
});

describe("calculateValues", () => {
	it("returns correct values", async () => {
		const { totalLiquidity, assetAmountCal, coreAmountCal } =
			await calculateValues(
				api,
				assets.CENNZ,
				coreAmount,
				assets.CPAY,
				assetAmount
			);

		const expectedTotalLiquidity = await api.derive.cennzx.totalLiquidity(
			assets.CENNZ.id
		);
		const expectedAmountCal = new Amount(
			coreAmount,
			AmountUnit.DISPLAY,
			assets.CENNZ.decimals
		);
		const expectedCoreAmountCal = new Amount(
			assetAmount,
			AmountUnit.DISPLAY,
			assets.CPAY.decimals
		);

		expect(totalLiquidity).toEqual(expectedTotalLiquidity);
		expect(assetAmountCal).toEqual(expectedAmountCal);
		expect(coreAmountCal).toEqual(expectedCoreAmountCal);
	});
});

describe("fetchAddLiquidityValues", () => {
	it("returns correct values", async () => {
		const buffer = 0.05;
		const { minLiquidity, maxAssetAmount, maxCoreAmount } =
			await fetchAddLiquidityValues(
				api,
				assets.CENNZ,
				assetAmount,
				assets.CPAY,
				coreAmount,
				exchangePool,
				buffer
			);

		const { totalLiquidity, assetAmountCal, coreAmountCal } =
			await calculateValues(
				api,
				assets.CENNZ,
				assetAmount,
				assets.CPAY,
				coreAmount
			);
		const expectedMinLiquidity = new Amount(coreAmountCal).mul(
			totalLiquidity.div(exchangePool.coreAssetBalance)
		);
		const expectedMaxAssetAmount = new Amount(assetAmountCal.muln(1 + buffer));

		expect(minLiquidity).toEqual(expectedMinLiquidity);
		expect(maxAssetAmount).toEqual(expectedMaxAssetAmount);
		expect(maxCoreAmount).toEqual(coreAmountCal);
	});
});

describe("fetchWithdrawLiquidityValues", () => {
	it("returns correct values", async () => {
		const buffer = 0.05;
		const { liquidityAmount, minAssetWithdraw, minCoreWithdraw } =
			await fetchWithdrawLiquidityValues(
				api,
				assets.CENNZ,
				testingAddress,
				assetAmount,
				assets.CPAY,
				coreAmount,
				exchangePool,
				false,
				buffer
			);

		const { totalLiquidity, assetAmountCal } = await calculateValues(
			api,
			assets.CENNZ,
			assetAmount,
			assets.CPAY,
			coreAmount
		);

		const expectedLiquidityAmount = assetAmountCal
			.mul(totalLiquidity)
			.div(exchangePool.assetBalance)
			.addn(1);
		const expectedMinAssetWithdraw = new Amount(
			assetAmountCal.muln(1 - buffer)
		);
		const coreWithdrawAmount = expectedLiquidityAmount
			.mul(exchangePool.coreAssetBalance)
			.div(totalLiquidity);
		const expectedMinCoreWithdraw = new Amount(
			coreWithdrawAmount.muln(1 - buffer)
		);

		expect(liquidityAmount).toEqual(expectedLiquidityAmount);
		expect(minAssetWithdraw).toEqual(expectedMinAssetWithdraw);
		expect(minCoreWithdraw).toEqual(expectedMinCoreWithdraw);
	});
	it("returns correct values when withdrawing max", async () => {
		const { liquidityAmount, minAssetWithdraw, minCoreWithdraw } =
			await fetchWithdrawLiquidityValues(
				api,
				assets.CENNZ,
				testingAddress,
				0,
				assets.CPAY,
				0,
				exchangePool,
				true
			);

		const expectedLiquidityAmount = await api.derive.cennzx.liquidityBalance(
			assets.CENNZ.id,
			testingAddress
		);
		const assetToWithdraw = await api.derive.cennzx.assetToWithdraw(
			assets.CENNZ.id,
			expectedLiquidityAmount
		);
		const expectedMinAssetWithdraw = assetToWithdraw.assetAmount;
		const expectedMinCoreWithdraw = assetToWithdraw.coreAmount;

		expect(liquidityAmount).toEqual(expectedLiquidityAmount);
		expect(minAssetWithdraw).toEqual(expectedMinAssetWithdraw);
		expect(minCoreWithdraw).toEqual(expectedMinCoreWithdraw);
	});
});

describe("fetchFeeEstimate", () => {
	it("estimates fee for addLiquidity", async () => {
		const { minLiquidity, maxAssetAmount, maxCoreAmount } =
			await fetchAddLiquidityValues(
				api,
				assets.CENNZ,
				assetAmount,
				assets.CPAY,
				coreAmount,
				exchangePool,
				0.05
			);
		const extrinsic = api.tx.cennzx.addLiquidity(
			assets.CENNZ.id,
			minLiquidity,
			maxAssetAmount,
			maxCoreAmount
		);
		const userFeeAssetId = assets.CPAY.id;
		const maxPayment = "50000000000000000";
		const feeEstimate = await fetchFeeEstimate(
			api,
			extrinsic,
			userFeeAssetId,
			maxPayment
		);

		const expectedFeeEstimate = await api.derive.fees.estimateFee({
			extrinsic,
			userFeeAssetId,
			maxPayment,
		});

		expect(feeEstimate).toEqual(new Amount(expectedFeeEstimate));
	});
	it("estimates fee for withdrawLiquidity", async () => {
		const { minLiquidity, maxAssetAmount, maxCoreAmount } =
			await fetchWithdrawLiquidityValues(
				api,
				assets.CENNZ,
				testingAddress,
				assetAmount,
				assets.CPAY,
				coreAmount,
				exchangePool,
				0.05,
				false
			);
		const extrinsic = api.tx.cennzx.addLiquidity(
			assets.CENNZ.id,
			minLiquidity,
			maxAssetAmount,
			maxCoreAmount
		);
		const userFeeAssetId = assets.CPAY.id;
		const maxPayment = "50000000000000000";
		const feeEstimate = await fetchFeeEstimate(
			api,
			extrinsic,
			userFeeAssetId,
			maxPayment
		);

		const expectedFeeEstimate = await api.derive.fees.estimateFee({
			extrinsic,
			userFeeAssetId,
			maxPayment,
		});

		expect(feeEstimate).toEqual(new Amount(expectedFeeEstimate));
	});
});
