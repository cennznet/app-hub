import { Api, SubmittableResult } from "@cennznet/api";
import Emittery from "emittery";
import { CENNZ_EXPLORER_URL } from "@/constants";
import { Event } from "@polkadot/types/interfaces";

interface EmitEvents {
	txCreated: undefined;
	txHashed: string;
	txSucceeded: SubmittableResult;
	txFailed: SubmittableResult;
	txCancelled: undefined;
}

export default class CENNZTransaction extends Emittery<EmitEvents> {
	public hash: string;

	constructor() {
		super();
		this.emit("txCreated");
	}

	setHash(hash: string) {
		const shouldEmit = this.hash !== hash;
		this.hash = hash;
		if (shouldEmit) this.emit("txHashed", hash);
	}

	setResult(result: SubmittableResult) {
		const { status, dispatchError } = result;

		if (status.isFinalized && !dispatchError)
			return this.emit("txSucceeded", result);

		if (status.isFinalized && dispatchError)
			return this.emit("txFailed", result);
	}

	setCancel() {
		this.emit("txCancelled");
	}

	decodeError(result: SubmittableResult): string {
		const { dispatchError } = result;
		if (!dispatchError?.isModule) return null;
		const { index, error } = dispatchError.asModule.toJSON();
		const errorMeta = dispatchError.registry.findMetaError(
			new Uint8Array([index as number, error as number])
		);
		return errorMeta?.section && errorMeta?.method
			? `${errorMeta.section}.${errorMeta.method}`
			: `I${index}E${error}`;
	}

	findEvent(
		result: SubmittableResult,
		eventSection: string,
		eventMethod: string
	): Event {
		const { events: records } = result;
		const record = records.find((record) => {
			const { event } = record;
			return event?.section === eventSection && event?.method === eventMethod;
		});

		return record?.event;
	}

	getHashLink(): string {
		let isNikau: boolean;
		const explorerUrl = CENNZ_EXPLORER_URL.replace("nikau.", (match) => {
			isNikau = true;
			return "";
		});
		const link = this.hash
			? `${explorerUrl}/extrinsic/${this.hash}?${
					isNikau ? "?network=Nikau" : ""
			  }`
			: null;
		return link;
	}
}
