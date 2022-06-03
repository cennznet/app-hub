import { Api } from "@cennznet/api";
import {
	BridgedEthereumToken,
	CENNZAsset,
	CENNZAssetBalances,
} from "@/libs/types";
import { Balance, fetchCENNZAssets } from "@utils";
import { stringToHex, hexToBn } from "@polkadot/util";

/**
 * Fetch balances of all registered CENNZ assets from a wallet address
 *
 * @param {Api} api
 * @param {string} address
 * @param {asset[]} selectedAssets
 * @return {Promise<CENNZAssetBalances>}
 */
export default async function fetchCENNZAssetBalances(
	api: Api,
	address: string,
	selectedAssets?: CENNZAsset[] | BridgedEthereumToken[]
): Promise<CENNZAssetBalances> {
	const assets = selectedAssets ? selectedAssets : await fetchCENNZAssets(api);

	const [assetLocks, freeBalances] = await Promise.all([
		(
			await api.query.genericAsset.locks.multi(
				assets.map(({ assetId }) => [assetId, address])
			)
		).map((lock) => lock.toJSON() as { id: string; amount: string }[]),

		await api.query.genericAsset.freeBalance.multi(
			assets.map(({ assetId }) => [assetId, address])
		),
	]);

	return freeBalances.reduce((balances, balance, index) => {
		const asset = assets[index];
		const stakingLock = assetLocks[index]?.find(
			(lock) => lock.id === stringToHex("staking ")
		);
		const stakingAmount = stakingLock
			? Balance.fromBN(hexToBn(stakingLock.amount), asset)
			: 0;
		const value = Balance.fromCodec(balance, asset).sub(stakingAmount);

		balances.push({
			...asset,
			value,
		});

		return balances;
	}, []);
}
