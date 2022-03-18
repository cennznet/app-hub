import { GenericCoin } from "@/types";
import Big, { BigSource } from "big.js";
import BN from "bn.js";

interface AsBalanceOptions {
	withSymbol: boolean;
}

type BalanceDescriptor = Pick<GenericCoin, "symbol" | "decimals">;

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

	toBalance(options = {} as AsBalanceOptions): string {
		const { withSymbol } = options || {};
		const { decimals, symbol } = this.coin;
		const precision = this.div(Math.pow(10, decimals));
		const suffix = withSymbol && symbol ? ` ${symbol}` : "";
		if (precision.eq(0)) return `0.0000${suffix}`;
		return `${
			precision.lt(0.0001) ? "<0.0001" : precision.toFixed(4)
		}${suffix}`;
	}

	getSymbol(): string {
		return this.coin?.symbol;
	}

	getDecimals(): number {
		return this.coin?.decimals;
	}

	static fromBN(source: BN, coin: BalanceDescriptor): Balance {
		return new Balance(source.toString(), coin);
	}

	static fromInput(input: string, coin: BalanceDescriptor): Balance {
		const value = Number(input) * Math.pow(10, coin.decimals);
		return new Balance(value, coin);
	}
}
