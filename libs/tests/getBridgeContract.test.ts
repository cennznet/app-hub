import getBridgeContract from "@/libs/utils/getBridgeContract";
import { ethers } from "ethers";
import CENNZnetBridge from "@/libs/artifacts/CENNZnetBridge.json";
import { KOVAN_BRIDGE_CONTRACT } from "@/libs/constants";

const { provider } = global.getWeb3MockForTest();

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
