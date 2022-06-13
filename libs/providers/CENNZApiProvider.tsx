import type { PropsWithChildren } from "@/libs/types";

import { FC, createContext, useState, useEffect, useContext } from "react";
import { Api } from "@cennznet/api";

type CENNZApiContextType = {
	api: Api;
};

const CENNZApiContext = createContext<CENNZApiContextType>(null);

interface CENNZApiProviderProps extends PropsWithChildren {
	endpoint: string;
}

const CENNZApiProvider: FC<CENNZApiProviderProps> = ({
	children,
	endpoint,
}) => {
	const [api, setApi] = useState<Api>(null);

	useEffect(() => {
		let apiReady = false;
		const initApi = () => {
			const instance = new Api({
				provider: endpoint,
			});

			instance.isReady.then(() => {
				apiReady = true;
				setApi(instance);
				window.onunload = () => instance.disconnect();
			});

			return instance;
		};

		const api = initApi();

		return () => {
			if (apiReady) void api.disconnect();
		};
	}, [endpoint]);

	return (
		<CENNZApiContext.Provider value={{ api }}>
			{children}
		</CENNZApiContext.Provider>
	);
};

export default CENNZApiProvider;

export function useCENNZApi(): CENNZApiContextType {
	return useContext(CENNZApiContext);
}
