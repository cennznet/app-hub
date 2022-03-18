import fetchPoolUserInfo from "@/utils/fetchPoolUserInfo";

const api = global.getCENNZApiForTest();
const { cennzAsset, cpayAsset } = global.getCENNZCoreAssetsForTest();
const testingAddress = "5DJTrWDe5vbs1aB9GWTX93SAz99SkC21KK8L2zfYU6LFpJYJ";

describe("fetchPoolUserInfo", () => {
	it("returns expected results", async () => {
		const info = await fetchPoolUserInfo(
			api,
			testingAddress,
			cennzAsset,
			cpayAsset
		);

		expect(typeof info.userAddress).toBe("string");
		expect(typeof info.coreAssetBalance).toBe("number");
		expect(typeof info.tradeAssetBalance).toBe("number");
		expect(typeof info.userLiquidity).toBe("number");
	});
});
