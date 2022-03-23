import { EthereumToken } from "@/types";
import { createContext, FC, useContext } from "react";

interface BridgeContextType {}

const BridgeContext = createContext<BridgeContextType>({} as BridgeContextType);

interface BridgeProviderProps {
	depositTokens: EthereumToken[];
	withdrawTokens: EthereumToken[];
}

const BridgeProvider: FC<BridgeProviderProps> = ({
	depositTokens,
	withdrawTokens,
	children,
}) => {
	return <BridgeContext.Provider value={{}}>{children}</BridgeContext.Provider>;
};

export default BridgeProvider;

export function useBridge(): BridgeContextType {
	return useContext(BridgeContext);
}
