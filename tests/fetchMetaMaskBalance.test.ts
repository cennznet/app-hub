import fetchMetaMaskBalance from "@/utils/fetchMetaMaskBalance";
import { BigNumber } from "ethers";
import GenericERC20Token from "@/artifacts/GenericERC20Token.json";
import { Balance } from "@/utils";

const { blockchain, provider, mock } = global.getWeb3MockForTest();
const { cennzAsset, ethAsset } = global.getEthereumAssetsForTest();
const testingAccount = "0x699aC2aedF058e76eD900FCc8cB31aB316B35bF2";

describe("fetchMetaMaskBalance", () => {
	it("returns expected value ETH", async () => {
		mock({
			blockchain,
			balance: {
				for: testingAccount,
				return: BigNumber.from(1),
			},
		});
		const balance = await fetchMetaMaskBalance(
			provider,
			testingAccount,
			ethAsset
		);

		const expected = new Balance(1, ethAsset);

		expect(balance).toEqual(expected);
	});
	it("returns expected value ERC20", async () => {
		mock({
			blockchain,
			call: {
				to: cennzAsset.address,
				api: GenericERC20Token,
				method: "balanceOf",
				params: testingAccount,
				return: BigNumber.from(1),
			},
		});
		const balance = await fetchMetaMaskBalance(
			provider,
			testingAccount,
			cennzAsset
		);

		const expected = new Balance(1, cennzAsset);

		expect(balance).toEqual(expected);
	});
});
