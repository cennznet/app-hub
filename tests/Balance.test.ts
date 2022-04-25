import Balance from "@/utils/Balance";
import { ethers } from "ethers";
import { Codec, Balance as ApiBalance } from "@cennznet/types";
import BN from "bn.js";

const CENNZ = {
	assetId: 16000,
	symbol: "CENNZ",
	decimals: 4,
	decimalsValue: 10000,
};
const ETH = {
	assetId: 17002,
	symbol: "ETH",
	decimals: 18,
	decimalsValue: 1000000000000000000,
};
const balance = new Balance(100, CENNZ);
const float = new Balance(12.34, CENNZ);

describe("Balance", () => {
	it("constructs a new Balance", () => {
		expect(balance.coin).toEqual(CENNZ);
	});
	it("can perform Big.js operations", () => {
		const abs = balance.abs();
		expect(abs).toEqual(balance);

		const div = balance.div(2);
		expect(div).toEqual(new Balance(50, CENNZ));

		const minus = balance.minus(30);
		const sub = balance.minus(70);
		expect(minus).toEqual(new Balance(70, CENNZ));
		expect(sub).toEqual(new Balance(30, CENNZ));

		const mod = balance.mod(12);
		expect(mod).toEqual(new Balance(4, CENNZ));

		const plus = balance.plus(50);
		expect(plus).toEqual(new Balance(150, CENNZ));

		const pow = balance.pow(2);
		expect(pow).toEqual(new Balance(10000, CENNZ));

		const prec = float.prec(3);
		expect(prec).toEqual(new Balance(12.3, CENNZ));

		const round = float.round(1);
		expect(round).toEqual(new Balance(12.3, CENNZ));

		const mul = balance.mul(2);
		const times = balance.mul(3);
		expect(mul).toEqual(new Balance(200, CENNZ));
		expect(times).toEqual(new Balance(300, CENNZ));

		const increase = balance.increase(5);
		expect(increase).toEqual(new Balance(105, CENNZ));

		const decrease = balance.decrease(3);
		expect(decrease).toEqual(new Balance(97, CENNZ));
	});
	it("can convert to input", () => {
		const input = balance.toInput();

		expect(input).toEqual("0.01");
	});
	it("can convert to balance with symbol", () => {
		const toBalance = balance.toBalance({ withSymbol: true });

		expect(toBalance).toEqual("0.01 CENNZ");
	});
	it("can covert to BigNumber", () => {
		const bigNumber = balance.toBigNumber();

		expect(bigNumber).toEqual(ethers.utils.parseUnits("0.01", 4));
	});
	it("can fetch symbol", () => {
		const symbol = balance.getSymbol();

		expect(symbol).toEqual("CENNZ");
	});
	it("can fetch decimals", () => {
		const decimals = balance.getDecimals();

		expect(decimals).toEqual(4);
	});
	it("can edit decimals", () => {
		const withDecimals = balance.withDecimals(18);

		expect(withDecimals).toEqual(new Balance(100, { ...CENNZ, decimals: 18 }));
	});
	it("can edit symbol", () => {
		const withSymbol = balance.withSymbol("wCENNZ");

		expect(withSymbol).toEqual(
			new Balance(100, { ...CENNZ, symbol: "wCENNZ" })
		);
	});
	it("can change coin", () => {
		const withCoin = balance.withCoin(ETH);

		expect(withCoin).toEqual(new Balance(100, ETH));
	});
	it.skip("TODO: can construct from Codec", () => {
		let codec: Codec;
		const fromCodec = Balance.fromCodec(codec, CENNZ);

		expect(fromCodec).toEqual(balance);
	});
	it("can construct from BN", () => {
		const fromBN = Balance.fromBN(new BN(100), CENNZ);

		expect(fromBN).toEqual(balance);
	});
	it.skip("TODO: can construct from ApiBalance", () => {
		let apiBalance: ApiBalance;
		const fromApiBalance = Balance.fromApiBalance(apiBalance, CENNZ);

		expect(fromApiBalance).toEqual(balance);
	});
	it("can construct from input", () => {
		const fromInput = Balance.fromInput("0.01", CENNZ);

		expect(fromInput).toEqual(balance);
	});
	it("can construct from BigNumber", () => {
		const fromBigNumber = Balance.fromBigNumber(
			ethers.utils.parseUnits("0.01", 4),
			CENNZ
		);

		expect(fromBigNumber).toEqual(balance);
	});
	it("can format balance for display", () => {
		const format = Balance.format(12345.6789123, CENNZ);

		expect(format).toEqual("12345.6789");

		const formatTiny = Balance.format(0.000001, CENNZ);

		expect(formatTiny).toEqual("<0.0001");
	});
});
