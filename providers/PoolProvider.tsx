import { CENNZAsset } from "@/types";
import { createContext, FC, useContext } from "react";

interface PoolContextType {}

const PoolContext = createContext<PoolContextType>({} as PoolContextType);

interface PoolProviderProps {
	supportedAssets: CENNZAsset[];
}

const PoolProvider: FC<PoolProviderProps> = ({ supportedAssets, children }) => {
	return <PoolContext.Provider value={{}}>{children}</PoolContext.Provider>;
};

export default PoolProvider;

export const usePool = (): PoolContextType => {
	return useContext(PoolContext);
};
