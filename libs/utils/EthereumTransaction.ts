import Emittery from "emittery";
import { ETHEREUM_NETWORK } from "@/libs/constants";

interface EmitEvents {
	txCreated: undefined;
	txHashed: string;
	txSucceeded: undefined;
	txFailed: string | number;
	txCancelled: undefined;
}

export default class EthereumTransaction extends Emittery<EmitEvents> {
	public hash: string;

	constructor() {
		super();
		this.emit("txCreated");
	}

	setHash(hash: string) {
		console.log("setHash", hash);
		const shouldEmit = this.hash !== hash;
		this.hash = hash;
		if (shouldEmit) this.emit("txHashed", hash);
	}

	setSuccess() {
		this.emit("txSucceeded");
	}

	setFailure(errorCode?: string | number) {
		this.emit("txFailed", errorCode);
	}

	setCancel() {
		this.emit("txCancelled");
	}

	getHashLink(): string {
		return this.hash ? `${ETHEREUM_NETWORK.ExplorerUrl}/tx/${this.hash}` : null;
	}
}
