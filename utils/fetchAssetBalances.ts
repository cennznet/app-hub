import { Api } from "@cennznet/api";
import { AssetInfo, BalanceInfo } from "@/types";
import { hexToString } from "@polkadot/util";
import ERC20Tokens from "@/artifacts/erc20tokens.json";

export const fetchAssetBalances = async (
	api: Api,
	assets: AssetInfo[],
	address: string
): Promise<Array<BalanceInfo>> => {
	const assetBalances = await Promise.all(
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
				address: tokenAddress,
			};
		})
	);

	const registeredAssets = await (
		api.rpc as any
	).genericAsset.registeredAssets();

	const tokenMap = {};

	for (const registeredAsset of registeredAssets) {
		const [tokenId, { symbol, decimalPlaces }] = registeredAsset;

		const existingBalance = assetBalances.find(
			(balance) => balance.id === Number(tokenId)
		);
		let tokenAddress: any = await api.query.erc20Peg.assetIdToErc20(tokenId);
		tokenAddress = tokenAddress.toJSON();

		const tokenChainId = Number(process.env.NEXT_PUBLIC_ETH_CHAIN_ID);
		const tokenOnChain = ERC20Tokens.tokens.find(
			(ERC20Token) =>
				ERC20Token.chainId === tokenChainId &&
				ERC20Token.address.toLowerCase() === tokenAddress
		);

		if (
			hexToString(symbol.toJSON()) === "" ||
			existingBalance ||
			!tokenAddress ||
			!tokenOnChain
		)
			continue;

		tokenMap[tokenId] = {
			id: Number(tokenId),
			symbol: hexToString(symbol.toJSON()),
			decimals: decimalPlaces.toNumber(),
			address: tokenOnChain.address,
			logo: tokenOnChain.logoURI,
		};
	}

	const balanceSubscriptionArg = Object.keys(tokenMap).map((tokenId, index) => {
		tokenMap[tokenId].index = index;
		return [tokenId, address];
	});
	await api.query.genericAsset.freeBalance.multi(
		balanceSubscriptionArg,
		(balances) => {
			Object.keys(tokenMap).forEach((tokenId) => {
				const token = tokenMap[tokenId];
				const tokenBalance: any =
					Number(balances[token.index]) / Math.pow(10, token.decimals);
				assetBalances.push({
					...tokenMap[tokenId],
					rawValue: balances[token.index],
					value: tokenBalance,
				});
			});
		}
	);

	return assetBalances;
};
