import fetchEthereumBalance from "@utils/fetchEthereumBalance";
import { BigNumber } from "ethers";
import GenericERC20Token from "@artifacts/GenericERC20Token.json";
import { Balance } from "@utils";

const { blockchain, provider, mock } = global.getWeb3MockForTest();
const { cennzAsset, ethAsset } = global.getEthereumAssetsForTest();
const testingAccount = global.getEthereumTestingAccount();

describe("fetchEthereumBalance", () => {
	it("returns expected value ETH", async () => {
		mock({
			blockchain,
			balance: {
				for: testingAccount,
				return: BigNumber.from(1),
			},
		});
		const balance = await fetchEthereumBalance(
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
		const balance = await fetchEthereumBalance(
			provider,
			testingAccount,
			cennzAsset
		);

		const expected = new Balance(1, cennzAsset);

		expect(balance).toEqual(expected);
	});
});
