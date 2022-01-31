import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { useCENNZApi } from "./CENNZApiProvider";
import { u8aToString } from "@polkadot/util";

const assetIds =
	process.env.NEXT_PUBLIC_SUPPORTED_ASSETS &&
	process.env.NEXT_PUBLIC_SUPPORTED_ASSETS.split(",");

export type AssetInfo = {
	id: number;
	symbol: string;
	decimals: number;
};

const SupportedAssetsContext = createContext<AssetInfo[]>([]);

type ProviderProps = {};

export default function SupportedAssetsProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	const [supportedAssets, setSupportedAssets] = useState<AssetInfo[]>();
	const { api } = useCENNZApi();

	useEffect(() => {
		if (!api) return;
		(async () => {
			try {
				const assets = await (api.rpc as any).genericAsset.registeredAssets();
				if (!assets?.length) return;
				const assetInfos = assetIds.map((assetId) => {
					const [tokenId, { symbol, decimalPlaces }] = assets?.find((asset) => {
						return asset[0].toString() === assetId;
					});
					return {
						id: Number(tokenId),
						symbol: u8aToString(symbol),
						decimals: decimalPlaces.toNumber(),
					};
				});

				console.log("assetInfos", assetInfos);

				setSupportedAssets(assetInfos);
			} catch (err) {
				if (err.message.includes("WebSocket is not connected"))
					console.log("Connecting api...");
				else console.log(err.message);
			}
		})();
	}, [api]);

	return (
		<SupportedAssetsContext.Provider value={supportedAssets}>
			{children}
		</SupportedAssetsContext.Provider>
	);
}

export function useAssets(): Array<AssetInfo> {
	return useContext(SupportedAssetsContext);
}
