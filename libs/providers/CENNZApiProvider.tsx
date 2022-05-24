import {
	FC,
	createContext,
	memo,
	useState,
	useEffect,
	useContext,
	PropsWithChildren,
} from "react";
import { Api } from "@cennznet/api";

type CENNZApiContextType = {
	api: Api;
};

const CENNZApiContext = createContext<CENNZApiContextType>(null);

interface CENNZApiProviderProps {
	endpoint: string;
}

const CENNZApiProvider: FC<PropsWithChildren<CENNZApiProviderProps>> = ({
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

export default memo(CENNZApiProvider);

export function useCENNZApi(): CENNZApiContextType {
	return useContext(CENNZApiContext);
}
