import {
	fetchTradeAmount,
	fetchCoreAmount,
	checkLiquidityBalances,
} from "../utils/pool";
import { Amount } from "../utils/Amount";

const exchangePool = {
	assetBalance: new Amount(20000),
	coreAssetBalance: new Amount(10000),
};
const userBalances = {
	coreAsset: 1000,
	tradeAsset: 500,
	coreLiquidity: 100,
	tradeLiquidity: 50,
};

describe("fetchTradeAmount", () => {
	it("returns correct value", () => {
		const coreAmount = 100;
		const tradeAmount = fetchTradeAmount(coreAmount, exchangePool);

		const expectedTradeAmount =
			(coreAmount * exchangePool.assetBalance.toNumber()) /
			exchangePool.coreAssetBalance.toNumber();

		expect(tradeAmount).toEqual(expectedTradeAmount);
	});
});

describe("fetchCoreAmount", () => {
	it("returns correct value", () => {
		const tradeAmount = 1000;
		const coreAmount = fetchCoreAmount(tradeAmount, exchangePool);

		const expectedCoreAmount =
			(tradeAmount * exchangePool.coreAssetBalance.toNumber()) /
			exchangePool.assetBalance.toNumber();

		expect(coreAmount).toEqual(expectedCoreAmount);
	});
});

describe("checkLiquidityBalances", () => {
	it("returns 'core' if user's core balance is too low", () => {
		let poolAction = "Add";
		const coreAmount = 1500;
		const tradeAmount = 10;

		let error = checkLiquidityBalances(
			poolAction,
			coreAmount,
			tradeAmount,
			userBalances
		);

		expect(error).toEqual("core");

		poolAction = "Withdraw";

		error = checkLiquidityBalances(
			poolAction,
			coreAmount,
			tradeAmount,
			userBalances
		);

		expect(error).toEqual("core");
	});
	it("returns 'trade' if user's trade balance is too low", () => {
		let poolAction = "Add";
		const coreAmount = 50;
		const tradeAmount = 2000;

		let error = checkLiquidityBalances(
			poolAction,
			coreAmount,
			tradeAmount,
			userBalances
		);

		expect(error).toEqual("trade");

		poolAction = "Withdraw";

		error = checkLiquidityBalances(
			poolAction,
			coreAmount,
			tradeAmount,
			userBalances
		);

		expect(error).toEqual("trade");
	});
	it("returns 'coreAndTrade' if both user's balances are too low", () => {
		let poolAction = "Add";
		const coreAmount = 2000;
		const tradeAmount = 1000;

		let error = checkLiquidityBalances(
			poolAction,
			coreAmount,
			tradeAmount,
			userBalances
		);

		expect(error).toEqual("coreAndTrade");

		poolAction = "Withdraw";

		error = checkLiquidityBalances(
			poolAction,
			coreAmount,
			tradeAmount,
			userBalances
		);

		expect(error).toEqual("coreAndTrade");
	});
	it("returns undefined if user has enough balance", () => {
		let poolAction = "Add";
		let coreAmount = 800;
		let tradeAmount = 400;

		let error = checkLiquidityBalances(
			poolAction,
			coreAmount,
			tradeAmount,
			userBalances
		);

		expect(error).toBe(undefined);

		poolAction = "Withdraw";
		coreAmount = 80;
		tradeAmount = 40;

		error = checkLiquidityBalances(
			poolAction,
			coreAmount,
			tradeAmount,
			userBalances
		);

		expect(error).toBe(undefined);
	});
});
