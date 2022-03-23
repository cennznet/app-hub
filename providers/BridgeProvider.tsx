import { createContext, FC, useContext } from "react";

interface BridgeContextType {}

const BridgeContext = createContext<BridgeContextType>({} as BridgeContextType);

interface BridgeProviderProps {}

const BridgeProvider: FC<BridgeProviderProps> = ({ children }) => {
	return <BridgeContext.Provider value={{}}>{children}</BridgeContext.Provider>;
};

export default BridgeProvider;

export function useBridge(): BridgeContextType {
	return useContext(BridgeContext);
}
