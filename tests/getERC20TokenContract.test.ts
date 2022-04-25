import getERC20TokenContract from "@/utils/getERC20TokenContract";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { mock } from "@depay/web3-mock";
import GenericERC20Token from "@/artifacts/GenericERC20Token.json";

const { cennzAsset } = global.getEthereumAssetsForTest();
const blockchain = "ethereum";
let provider: Web3Provider;
beforeAll(() => {
	mock({
		blockchain,
	});
	provider = new ethers.providers.Web3Provider(global.ethereum);
});

describe("getERC20TokenContract", () => {
	it("returns read only contract", async () => {
		const cennz = await getERC20TokenContract<"ReadOnly">(cennzAsset, provider);

		const expected = new ethers.Contract(
			cennzAsset.address,
			GenericERC20Token,
			provider
		);

		expect(JSON.stringify(cennz)).toEqual(JSON.stringify(expected));
	});
	it("returns on behalf contract", async () => {
		const signer = provider.getSigner();
		const cennz = await getERC20TokenContract<"OnBehalf">(cennzAsset, signer);

		const expected = new ethers.Contract(
			cennzAsset.address,
			GenericERC20Token,
			signer
		);

		expect(JSON.stringify(cennz)).toEqual(JSON.stringify(expected));
	});
});
