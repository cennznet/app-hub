import { Api } from "@cennznet/api";
import {
  createContext,
  useState,
  PropsWithChildren,
  useContext,
  useCallback,
} from "react";

type CENNZApiContextType = {
  api: Api;
  updateApi: Function;
};

const CENNZApiContext = createContext<CENNZApiContextType>(null);

export default function CENNZApiProvider({ children }: PropsWithChildren<{}>) {
  const [api, setApi] = useState<Api>(null);

  const updateApi = useCallback((endpoint) => {
    const instance = new Api({ provider: endpoint });
    instance.isReady.then(() => setApi(instance));
  }, []);

  return (
    <CENNZApiContext.Provider value={{ api, updateApi }}>
      {children}
    </CENNZApiContext.Provider>
  );
}

export function useCENNZApi(): CENNZApiContextType {
  return useContext(CENNZApiContext);
}
