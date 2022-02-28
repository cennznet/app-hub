import { act, renderHook } from "@testing-library/react-hooks";
import PoolProvider, { usePool } from "@/providers/PoolProvider";
import { Api } from "@cennznet/api";

const selectedAccount = {
	address: "5FbMzsoEpd2mt8eyKpKUxwJ5S9W7nJVJkCer2Jk7tvSpB1vF",
	meta: {
		genesisHash: null,
		name: "nikau-testing",
		source: "test",
	},
};
const assets = {
	CPAY: {
		symbol: "CPAY",
		decimalPlaces: "4",
		existentialDeposit: "1",
		id: 16001,
	},
	CENNZ: {
		symbol: "CENNZ",
		decimalPlaces: "4",
		existentialDeposit: "1",
		id: 16000,
	},
};

let api: Api;
beforeAll(async () => {
	api = await Api.create({ provider: "wss://nikau.centrality.me/public/ws" });
});

afterAll(async () => {
	await api.disconnect();
});

test("should define functions, and fetch exchangePool & userPoolShare", async () => {
	const wrapper = ({ children }) => (
		<PoolProvider api={api} selectedAccount={selectedAccount}>
			{children}
		</PoolProvider>
	);

	const { result, waitForNextUpdate } = renderHook(() => usePool(), {
		wrapper,
	});
	await waitForNextUpdate({ timeout: 10000 });

	const {
		getUserPoolShare,
		updateExchangePool,
		defineExtrinsic,
		sendExtrinsic,
		coreAsset,
	}: any = result.current;

	expect(getUserPoolShare).toBeDefined();
	expect(updateExchangePool).toBeDefined();
	expect(defineExtrinsic).toBeDefined();
	expect(sendExtrinsic).toBeDefined();

	expect(coreAsset).toEqual(assets.CPAY);

	await act(async () => {
		await updateExchangePool(assets.CENNZ);
	});
	const { exchangePool }: any = result.current;
	expect(exchangePool.address).toEqual(
		"5DwJXhQP4W9VLR3RoPNLX6mGdtFtJyd7zaWUDf89fS8cP2eg"
	);
	expect(exchangePool.assetId).toEqual(assets.CENNZ.id);
	expect(exchangePool.assetBalance).toBeDefined();
	expect(exchangePool.coreAssetBalance).toBeDefined();

	await act(async () => {
		await getUserPoolShare(assets.CENNZ);
	});
	const { userPoolShare }: any = result.current;
	expect(userPoolShare.address).toEqual(selectedAccount.address);
	expect(userPoolShare.assetId).toEqual(assets.CENNZ.id);
	expect(userPoolShare.assetBalance).toBeDefined();
	expect(userPoolShare.coreAssetBalance).toBeDefined();
	expect(userPoolShare.liquidity).toBeDefined();
});
