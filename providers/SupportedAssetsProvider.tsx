import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { useCENNZApi } from "@/providers/CENNZApiProvider";
import { u8aToString } from "@polkadot/util";
import { AssetInfo } from "@/types";
import { ETH_LOGO } from "@/utils/bridge/helpers";

const assetIds =
	process.env.NEXT_PUBLIC_SUPPORTED_ASSETS &&
	process.env.NEXT_PUBLIC_SUPPORTED_ASSETS.split(",");

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
					const logo =
						u8aToString(symbol) === "ETH"
							? ETH_LOGO
							: `/images/${u8aToString(symbol).toLowerCase()}.svg`;
					return {
						id: Number(tokenId),
						symbol: u8aToString(symbol),
						decimals: decimalPlaces.toNumber(),
						logo: logo,
					};
				});

				setSupportedAssets(assetInfos);
			} catch (err) {
				console.log(err.message);
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
