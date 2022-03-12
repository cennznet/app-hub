import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";

export declare global {
	function getCENNZApiForTest(): Api;
	function getCENNZCoreAssetForTest(): {
		cennzAsset: CENNZAsset;
		cpayAsset: CENNZAsset;
	};
}
