import { CENNZAsset } from "@/libs/types";
import { Api } from "@cennznet/api";
import { ExternalProvider } from "@metamask/providers";

export declare global {
	function getCENNZApiForTest(): Api;
	function getCENNZCoreAssetsForTest(): {
		cennzAsset: CENNZAsset;
		cpayAsset: CENNZAsset;
	};

	var ethereum: ExternalProvider;
}
