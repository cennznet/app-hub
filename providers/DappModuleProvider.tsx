import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import type * as Extension from "@polkadot/extension-dapp";

type ModuleContext = typeof Extension;
const DappModuleContext = createContext<ModuleContext>({} as ModuleContext);

type ProviderProps = {};

export default function DappModuleProvider({
  children,
}: PropsWithChildren<ProviderProps>) {
  const [extension, setExtension] = useState<ModuleContext>(
    {} as ModuleContext
  );
  useEffect(() => {
    import("@polkadot/extension-dapp").then((module) => {
      setExtension(module);
    });
  }, []);

  return (
    <DappModuleContext.Provider value={extension}>
      {children}
    </DappModuleContext.Provider>
  );
}

export function useDappModule(): ModuleContext {
  return useContext(DappModuleContext);
}
