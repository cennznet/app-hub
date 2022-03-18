import { GenericCoin } from "@/types";
import { Codec, Balance as ApiBalance } from "@cennznet/types";
import { PercentTwoTone } from "@mui/icons-material";
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

	addPerc(value: number): Balance {
		const withPercentage = this.mul(1 + value / 100);
		return new Balance(withPercentage, this.coin);
	}

	minusPerc(value: number): Balance {
		const withPercentage = this.mul(1 - value / 100);
		return new Balance(withPercentage, this.coin);
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

	static format(source: number | Big): string {
		const value = (source as Big)?.toNumber?.() ?? source;
		if (value === 0) return "0.0000";
		return value < 0.0001 ? "<0.0001" : value.toFixed(4);
	}
}
