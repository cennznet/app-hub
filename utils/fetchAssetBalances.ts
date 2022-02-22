import { Api } from "@cennznet/api";
import { AssetInfo, BalanceInfo } from "@/types";

export const fetchAssetBalances = async (
	api: Api,
	assets: AssetInfo[],
	address: string
): Promise<Array<BalanceInfo>> => {
	return Promise.all(
		(
			await api.query.genericAsset.freeBalance.multi(
				assets.map(({ id }) => [id, address])
			)
		).map(async (balance, index) => {
			const asset = assets[index];
			let tokenAddress: any = await api.query.erc20Peg.assetIdToErc20(asset.id);
			tokenAddress = tokenAddress.toJSON();
			return {
				...asset,
				rawValue: balance as any,
				value: (balance as any) / Math.pow(10, asset.decimals),
				tokenAddress,
			};
		})
	);
};
