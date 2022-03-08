import { CENNZAsset } from "@/types";
import { Api } from "@cennznet/api";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import Big from "big.js";

// TODO: Need test
export default function getBuyAssetExtrinsic(
	api: Api,
	exchangeToken: CENNZAsset,
	exchangeTokenValue: string,
	receivedToken: CENNZAsset,
	receivedTokenValue: string,
	slippagePercentage: number
): SubmittableExtrinsic<"promise"> {
	const exchangeAmount: Big = new Big(exchangeTokenValue).mul(
		exchangeToken.decimalsValue
	);
	const receivedAmount: Big = new Big(receivedTokenValue).mul(
		receivedToken.decimalsValue
	);
	const maxExchangeAmount: Big = exchangeAmount.mul(
		1 + slippagePercentage / 100
	);

	return api.tx.cennzx.buyAsset(
		null,
		exchangeToken.assetId,
		receivedToken.assetId,
		receivedAmount.toFixed(0).toString(),
		maxExchangeAmount.toFixed(0).toString()
	);
}
