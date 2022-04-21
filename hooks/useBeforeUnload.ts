import { useEffect } from "react";

export default function useBeforeUnload(txStatus) {
	useEffect(() => {
		const beforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			if (txStatus?.status === "Pending") return (event.returnValue = "");
		};

		window.addEventListener("beforeunload", beforeUnload);

		return () => window.removeEventListener("beforeunload", beforeUnload);
	}, [txStatus]);
}
