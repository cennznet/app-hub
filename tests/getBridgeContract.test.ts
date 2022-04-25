import getBridgeContract from "@/utils/getBridgeContract";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { mock } from "@depay/web3-mock";
import CENNZnetBridge from "@/artifacts/CENNZnetBridge.json";
import { KOVAN_BRIDGE_CONTRACT } from "@/constants";

const blockchain = "ethereum";
let provider: Web3Provider;
beforeAll(() => {
	mock({
		blockchain,
	});
	provider = new ethers.providers.Web3Provider(global.ethereum);
});

describe("getBridgeContract", () => {
	it("returns read only contract", async () => {
		const bridge = await getBridgeContract<"ReadOnly">(provider);

		const expected = new ethers.Contract(
			KOVAN_BRIDGE_CONTRACT,
			CENNZnetBridge,
			provider
		);

		expect(JSON.stringify(bridge)).toEqual(JSON.stringify(expected));
	});
	it("returns on behalf contract", async () => {
		const signer = provider.getSigner();
		const bridge = await getBridgeContract<"OnBehalf">(signer);

		const expected = new ethers.Contract(
			KOVAN_BRIDGE_CONTRACT,
			CENNZnetBridge,
			signer
		);

		expect(JSON.stringify(bridge)).toEqual(JSON.stringify(expected));
	});
});
