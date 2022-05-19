import getERC20PegContract from "@/utils/getERC20PegContract";
import { ethers } from "ethers";
import ERC20Peg from "@/artifacts/ERC20Peg.json";
import { ROPSTEN_PEG_CONTRACT } from "@/constants";

const { provider } = global.getWeb3MockForTest();

describe("getERC20PegContract", () => {
	it("returns read only contract", async () => {
		const peg = await getERC20PegContract<"ReadOnly">(provider);

		const expected = new ethers.Contract(
			ROPSTEN_PEG_CONTRACT,
			ERC20Peg,
			provider
		);

		expect(JSON.stringify(peg)).toEqual(JSON.stringify(expected));
	});
	it("returns on behalf contract", async () => {
		const signer = provider.getSigner();
		const peg = await getERC20PegContract<"OnBehalf">(signer);

		const expected = new ethers.Contract(
			ROPSTEN_PEG_CONTRACT,
			ERC20Peg,
			signer
		);

		expect(JSON.stringify(peg)).toEqual(JSON.stringify(expected));
	});
});
