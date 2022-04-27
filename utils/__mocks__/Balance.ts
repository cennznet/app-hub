import { GenericCoin } from "@/types";
import { Codec } from "@cennznet/types";
import { Balance as ApiBalance } from "@polkadot/types/interfaces/runtime/types";
import Big, { BigSource } from "big.js";

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

	static fromCodec(source: Codec, coin: BalanceDescriptor): Balance {
		return new Balance("100", coin);
	}

	static fromApiBalance(source: ApiBalance, coin: BalanceDescriptor): Balance {
		return new Balance("100", coin);
	}
}
