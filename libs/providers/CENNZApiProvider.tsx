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
		const instance = new Api({
			provider: endpoint,
		});

		instance.isReady.then(() => {
			setApi(instance);
			window.onunload = async () => await instance.disconnect();
		});

		return () => {
			void instance.disconnect();
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
