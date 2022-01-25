import {
  createContext,
  useState,
  PropsWithChildren,
  useContext,
  useCallback,
} from "react";
import { Api, ApiRx, } from "@cennznet/api";
import { Observable } from "@cennznet/types";

type CENNZApiContextType = {
  api: Api;
  updateApi: Function;
  apiRx: Observable<ApiRx>;
  updateApiRx: Function;
};

const CENNZApiContext = createContext<CENNZApiContextType>(null);

export default function CENNZApiProvider({ children }: PropsWithChildren<{}>) {
  const [api, setApi] = useState<Api>(null);
  const [apiRx, setApiRx] = useState<Observable<ApiRx>>(null);

  const updateApi = useCallback((endpoint) => {
    const instance = new Api({ provider: endpoint });
    instance.isReady.then(() => setApi(instance));
  }, []);

  const updateApiRx = useCallback((endpoint) => {
    const instance = ApiRx.create({ provider: endpoint })
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
