import { Api } from "@cennznet/api";
import { AssetInfo } from "@/types";
import fetchSupportedAssets from "@/utils/fetchSupportedAssets";

export type GlobalProps = {
	supportedAssets: AssetInfo[];
};

export default async function generateGlobalProps(): Promise<GlobalProps> {
	const api = await Api.create({ provider: process.env.NEXT_PUBLIC_API_URL });

	const supportedAssetIds =
		process.env.NEXT_PUBLIC_SUPPORTED_ASSETS.split(",").map(Number);
	return {
		supportedAssets: await fetchSupportedAssets(api, supportedAssetIds),
	};
}
