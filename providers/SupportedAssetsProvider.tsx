import { createContext, PropsWithChildren, useContext } from "react";

import { AssetInfo } from "@/types";

const SupportedAssetsContext = createContext<AssetInfo[]>([]);

type ProviderProps = {
	supportedAssets: AssetInfo[];
};

export default function SupportedAssetsProvider({
	children,
	supportedAssets,
}: PropsWithChildren<ProviderProps>) {
	return (
		<SupportedAssetsContext.Provider value={supportedAssets}>
			{children}
		</SupportedAssetsContext.Provider>
	);
}

export function useAssets(): Array<AssetInfo> {
	return useContext(SupportedAssetsContext);
}
