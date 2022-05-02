import Balance from "@/utils/Balance";
import { ethers } from "ethers";
import BN from "bn.js";

const api = global.getCENNZApiForTest();
const { cennzAsset, ethAsset } = global.getEthereumAssetsForTest();
const balance = new Balance(100, cennzAsset);
const float = new Balance(12.34, cennzAsset);

describe("Balance", () => {
	it("constructs a new Balance", () => {
		expect(balance.coin).toEqual(cennzAsset);
	});
	it("can perform Big.js operations", () => {
		const abs = balance.abs();
		expect(abs).toEqual(balance);

		const div = balance.div(2);
		expect(div).toEqual(new Balance(50, cennzAsset));

		const minus = balance.minus(30);
		const sub = balance.minus(70);
		expect(minus).toEqual(new Balance(70, cennzAsset));
		expect(sub).toEqual(new Balance(30, cennzAsset));

		const mod = balance.mod(12);
		expect(mod).toEqual(new Balance(4, cennzAsset));

		const plus = balance.plus(50);
		expect(plus).toEqual(new Balance(150, cennzAsset));

		const pow = balance.pow(2);
		expect(pow).toEqual(new Balance(10000, cennzAsset));

		const prec = float.prec(3);
		expect(prec).toEqual(new Balance(12.3, cennzAsset));

		const round = float.round(1);
		expect(round).toEqual(new Balance(12.3, cennzAsset));

		const mul = balance.mul(2);
		const times = balance.mul(3);
		expect(mul).toEqual(new Balance(200, cennzAsset));
		expect(times).toEqual(new Balance(300, cennzAsset));

		const increase = balance.increase(5);
		expect(increase).toEqual(new Balance(105, cennzAsset));

		const decrease = balance.decrease(3);
		expect(decrease).toEqual(new Balance(97, cennzAsset));
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

		expect(withDecimals).toEqual(
			new Balance(100, { ...cennzAsset, decimals: 18 })
		);
	});
	it("can edit symbol", () => {
		const withSymbol = balance.withSymbol("wcennzAsset");

		expect(withSymbol).toEqual(
			new Balance(100, { ...cennzAsset, symbol: "wcennzAsset" })
		);
	});
	it("can change coin", () => {
		const withCoin = balance.withCoin(ethAsset);

		expect(withCoin).toEqual(new Balance(100, ethAsset));
	});
	it("can construct from Codec", () => {
		const fromCodec = Balance.fromCodec(
			api.registry.createType("Balance", 100),
			cennzAsset
		);

		expect(fromCodec).toEqual(new Balance("100", cennzAsset));
	});
	it("can construct from BN", () => {
		const fromBN = Balance.fromBN(new BN(100), cennzAsset);

		expect(fromBN).toEqual(balance);
	});
	it("can construct from ApiBalance", () => {
		const fromCodec = Balance.fromApiBalance(
			api.registry.createType("Balance", 100),
			cennzAsset
		);

		expect(fromCodec).toEqual(new Balance("100", cennzAsset));
	});
	it("can construct from input", () => {
		const fromInput = Balance.fromInput("0.01", cennzAsset);

		expect(fromInput).toEqual(balance);
	});
	it("can construct from BigNumber", () => {
		const fromBigNumber = Balance.fromBigNumber(
			ethers.utils.parseUnits("0.01", 4),
			cennzAsset
		);

		expect(fromBigNumber).toEqual(balance);
	});
	it("can format balance for display", () => {
		const format = Balance.format(12345.6789123, cennzAsset);

		expect(format).toEqual("12345.6789");

		const formatTiny = Balance.format(0.000001, cennzAsset);

		expect(formatTiny).toEqual("<0.0001");
	});
});
