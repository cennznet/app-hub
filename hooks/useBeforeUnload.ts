import { useEffect } from "react";
import { TxStatus } from "@/types";

export default function useBeforeUnload(txStatus: TxStatus) {
	useEffect(() => {
		const beforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			if (txStatus?.status === "Pending") return (event.returnValue = "");
		};

		window.addEventListener("beforeunload", beforeUnload);

		return () => window.removeEventListener("beforeunload", beforeUnload);
	}, [txStatus]);
}
