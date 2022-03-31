import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";

export declare global {
	function getCENNZApiForTest(): Api;
	function getCENNZCoreAssetsForTest(): {
		cennzAsset: CENNZAsset;
		cpayAsset: CENNZAsset;
	};

	var ethereum: MetaMaskInpageProvider;
}
