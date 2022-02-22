import {
	createContext,
	useState,
	PropsWithChildren,
	useEffect,
	useContext,
} from "react";
import { Api } from "@cennznet/api";

const endpoint = process.env.NEXT_PUBLIC_API_URL;

type CENNZApiContextType = {
	api: Api;
};

const CENNZApiContext = createContext<CENNZApiContextType>(null);

export default function CENNZApiProvider({ children }: PropsWithChildren<{}>) {
	const [api, setApi] = useState<Api>(null);

	useEffect(() => {
		const instance = new Api({
			provider: endpoint,
		});
		instance.isReady.then(() => {
			setApi(instance);
			window.onunload = async () => await instance.disconnect();
		});
	}, []);

	return (
		<CENNZApiContext.Provider value={{ api }}>
			{children}
		</CENNZApiContext.Provider>
	);
}

export function useCENNZApi(): CENNZApiContextType {
	return useContext(CENNZApiContext);
}
