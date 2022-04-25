import getERC20PegContract from "@/utils/getERC20PegContract";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { mock } from "@depay/web3-mock";
import ERC20Peg from "@/artifacts/ERC20Peg.json";
import { KOVAN_PEG_CONTRACT } from "@/constants";

const blockchain = "ethereum";
let provider: Web3Provider;
beforeAll(() => {
	mock({
		blockchain,
	});
	provider = new ethers.providers.Web3Provider(global.ethereum);
});

describe("getERC20PegContract", () => {
	it("returns read only contract", async () => {
		const peg = await getERC20PegContract<"ReadOnly">(provider);

		const expected = new ethers.Contract(
			KOVAN_PEG_CONTRACT,
			ERC20Peg,
			provider
		);

		expect(JSON.stringify(peg)).toEqual(JSON.stringify(expected));
	});
	it("returns on behalf contract", async () => {
		const signer = provider.getSigner();
		const peg = await getERC20PegContract<"OnBehalf">(signer);

		const expected = new ethers.Contract(KOVAN_PEG_CONTRACT, ERC20Peg, signer);

		expect(JSON.stringify(peg)).toEqual(JSON.stringify(expected));
	});
});
