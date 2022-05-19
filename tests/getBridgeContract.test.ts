import getBridgeContract from "@/utils/getBridgeContract";
import { ethers } from "ethers";
import CENNZnetBridge from "@/artifacts/CENNZnetBridge.json";
import { ROPSTEN_BRIDGE_CONTRACT } from "@/constants";

const { provider } = global.getWeb3MockForTest();

describe("getBridgeContract", () => {
	it("returns read only contract", async () => {
		const bridge = await getBridgeContract<"ReadOnly">(provider);

		const expected = new ethers.Contract(
			ROPSTEN_BRIDGE_CONTRACT,
			CENNZnetBridge,
			provider
		);

		expect(JSON.stringify(bridge)).toEqual(JSON.stringify(expected));
	});
	it("returns on behalf contract", async () => {
		const signer = provider.getSigner();
		const bridge = await getBridgeContract<"OnBehalf">(signer);

		const expected = new ethers.Contract(
			ROPSTEN_BRIDGE_CONTRACT,
			CENNZnetBridge,
			signer
		);

		expect(JSON.stringify(bridge)).toEqual(JSON.stringify(expected));
	});
});
