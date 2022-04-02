import { Api, SubmittableResult } from "@cennznet/api";
import Emittery from "emittery";
import { CENNZ_EXPLORER_URL } from "@/constants";

interface EmitEvents {
	txCreated: undefined;
	txHashed: string;
	txPending: SubmittableResult;
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

		if (status.isInBlock) return this.emit("txPending", result);

		if (status.isFinalized && !dispatchError)
			return this.emit("txSucceeded", result);

		if (status.isFinalized && dispatchError)
			return this.emit("txFailed", result);
	}

	setCancel() {
		this.emit("txCancelled");
	}

	decodeError(api: Api, result: SubmittableResult): string {
		const { dispatchError } = result;
		console.log(dispatchError);
		if (!dispatchError?.isModule) return null;
		const { index, error } = dispatchError.asModule.toJSON();
		const errorMeta = api.registry.findMetaError(
			new Uint8Array([index as number, error as number])
		);
		return errorMeta?.section && errorMeta?.name
			? `${errorMeta.section}.${errorMeta.name}`
			: `I${index}E${error}`;
	}

	getExplorerLink(hash: string): string {
		return `${CENNZ_EXPLORER_URL}/extrinsic/${hash}`;
	}
}
