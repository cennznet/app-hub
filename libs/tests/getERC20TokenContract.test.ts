import getERC20TokenContract from "@/libs/utils/getERC20TokenContract";
import { ethers } from "ethers";
import GenericERC20Token from "@/libs/artifacts/GenericERC20Token.json";

const { cennzAsset } = global.getEthereumAssetsForTest();
const { provider } = global.getWeb3MockForTest();

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
