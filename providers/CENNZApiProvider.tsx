import {
	createContext,
	useState,
	PropsWithChildren,
	useContext,
	useCallback,
} from "react";
import { Api, ApiRx } from "@cennznet/api";

const endpoint = process.env.NEXT_PUBLIC_API_URL;

type CENNZApiContextType = {
	api: Api;
	initApi: Function;
	apiRx: Promise<ApiRx>;
	initApiRx: Function;
};

const CENNZApiContext = createContext<CENNZApiContextType>(null);

export default function CENNZApiProvider({ children }: PropsWithChildren<{}>) {
	const [api, setApi] = useState<Api>(null);
	const [apiRx, setApiRx] = useState<Promise<ApiRx>>(null);

	const initApi = useCallback(() => {
		const instance = new Api({
			provider: endpoint,
		});
		instance.isReady.then(() => {
			setApi(instance);
			window.onunload = async () => await instance.disconnect();
		});
	}, []);

	const initApiRx = useCallback(() => {
		const instance = ApiRx.create({
			provider: endpoint,
		}).toPromise();
		setApiRx(instance);
	}, []);

	return (
		<CENNZApiContext.Provider value={{ api, initApi, apiRx, initApiRx }}>
			{children}
		</CENNZApiContext.Provider>
	);
}

export function useCENNZApi(): CENNZApiContextType {
	return useContext(CENNZApiContext);
}
