import { useCallback, useState } from "react";
import { TxStatus, TxType } from "@/types";

export interface TxStatusHook {
	txStatus: TxStatus;
	setTxIdle: (props?: any) => void;
	setTxPending: (props?: any) => void;
	setTxFailure: (props?: any) => void;
	setTxSuccess: (props?: any) => void;
}

export default function useTxStatus(defaultValue: TxStatus = null) {
	const [txStatus, setTxStatus] = useState<TxStatus>(defaultValue);

	const createTxStatusTrigger = useCallback((status: TxType) => {
		return (props?: any) => {
			if (status === "Idle") return setTxStatus(null);

			setTxStatus({
				status,
				props,
			});
		};
	}, []);

	return {
		txStatus,
		setTxIdle: createTxStatusTrigger("Idle"),
		setTxPending: createTxStatusTrigger("Pending"),
		setTxSuccess: createTxStatusTrigger("Success"),
		setTxFailure: createTxStatusTrigger("Failure"),
	};
}
