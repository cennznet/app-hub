import {
  createContext,
  useState,
  PropsWithChildren,
  useContext,
  useCallback,
} from "react";
import { Api, ApiRx } from "@cennznet/api";

type CENNZApiContextType = {
  api: Api;
  updateApi: Function;
  apiRx: Promise<ApiRx>;
  updateApiRx: Function;
};

const CENNZApiContext = createContext<CENNZApiContextType>(null);

export default function CENNZApiProvider({ children }: PropsWithChildren<{}>) {
  const [api, setApi] = useState<Api>(null);
  const [apiRx, setApiRx] = useState<Promise<ApiRx>>(null);

  const updateApi = useCallback((endpoint) => {
    const instance = new Api({ provider: endpoint });
    instance.isReady.then(() => setApi(instance));
  }, []);

  const updateApiRx = useCallback((endpoint) => {
    const instance = ApiRx.create({ provider: endpoint }).toPromise()
    setApiRx(instance)
  }, [])

  return (
    <CENNZApiContext.Provider value={{ api, updateApi, apiRx, updateApiRx }}>
      {children}
    </CENNZApiContext.Provider>
  );
}

export function useCENNZApi(): CENNZApiContextType {
  return useContext(CENNZApiContext);
}
