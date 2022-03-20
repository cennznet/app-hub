import { GenericCoin } from "@/types";
import { Codec, Balance as ApiBalance } from "@cennznet/types";
import Big, { BigSource, RoundingMode } from "big.js";
import BN from "bn.js";

interface AsBalanceOptions {
	withSymbol: boolean;
}

type BalanceDescriptor = Pick<GenericCoin, "symbol" | "decimals">;
type BalanceSource = BigSource | Balance;

export default class Balance extends Big {
	coin: BalanceDescriptor;

	constructor(source: BigSource, coin: BalanceDescriptor) {
		super(source);
		this.coin = {
			decimals: 0,
			symbol: "",
			...coin,
		};
	}

	override abs(): Balance {
		return new Balance(super.abs(), this.coin);
	}

	override div(n: BalanceSource): Balance {
		return new Balance(super.div(n), this.coin);
	}

	override minus(n: BalanceSource): Balance {
		return new Balance(super.minus(n), this.coin);
	}

	override mod(n: BalanceSource): Balance {
		return new Balance(super.mod(n), this.coin);
	}

	override plus(n: BalanceSource): Balance {
		return new Balance(super.plus(n), this.coin);
	}

	override pow(n: number): Balance {
		return new Balance(super.pow(n), this.coin);
	}

	override prec(sd: number, rm?: RoundingMode): Balance {
		return new Balance(super.prec(sd, rm), this.coin);
	}

	override round(sd: number, rm?: RoundingMode): Balance {
		return new Balance(super.round(sd, rm), this.coin);
	}

	override sqrt(): Balance {
		return new Balance(super.sqrt(), this.coin);
	}

	override mul(n: BalanceSource): Balance {
		return new Balance(super.mul(n), this.coin);
	}

	override times(n: BalanceSource): Balance {
		return new Balance(super.times(n), this.coin);
	}

	increase(n: number | string): Balance {
		return this.mul(1 + Number(n) / 100);
	}

	decrease(n: number | string): Balance {
		return this.mul(1 - Number(n) / 100);
	}

	toBalance(options = {} as AsBalanceOptions): string {
		const { withSymbol } = options || {};
		const { decimals, symbol } = this.coin;
		const output = Balance.format(this.div(Math.pow(10, decimals)));
		const suffix = withSymbol && symbol ? ` ${symbol}` : "";

		return `${output}${suffix}`;
	}

	getSymbol(): string {
		return this.coin?.symbol;
	}

	getDecimals(): number {
		return this.coin?.decimals;
	}

	withDecimals(n: number): Balance {
		return new Balance(this, { ...this.coin, decimals: n });
	}

	withSymbol(s: string): Balance {
		return new Balance(this, { ...this.coin, symbol: s });
	}

	withCoin(c: GenericCoin): Balance {
		return new Balance(this, c);
	}

	static fromCodec(source: Codec, coin: BalanceDescriptor): Balance {
		return new Balance(source.toString(), coin);
	}

	static fromBN(source: BN, coin: BalanceDescriptor): Balance {
		return new Balance(source.toString(), coin);
	}

	static fromApiBalance(source: ApiBalance, coin: BalanceDescriptor): Balance {
		return new Balance(source.toString(), coin);
	}

	static fromInput(source: string, coin: BalanceDescriptor): Balance {
		const value = Number(source || 0) * Math.pow(10, coin?.decimals || 0);
		return new Balance(value, coin);
	}

	static format(source: BalanceSource): string {
		const value = new Balance(source, null);
		if (value.lte(0)) return Number(0).toFixed(4);
		return value.lt(0.0001) ? "<0.0001" : value.toFixed(4, Big.roundDown);
	}
}
