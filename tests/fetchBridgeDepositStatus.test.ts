import fetchBridgeDepositStatus, {
	ensureBridgeDepositActive,
} from "@/utils/fetchBridgeDepositStatus";
import { Api } from "@cennznet/api";
import { ethers } from "ethers";
import { mock } from "@depay/web3-mock";
import { Web3Provider } from "@ethersproject/providers";
import { KOVAN_PEG_CONTRACT } from "@/constants";
import ERC20Peg from "@/artifacts/ERC20Peg.json";

const api: Api = global.getCENNZApiForTest();

describe("fetchBridgeDepositStatus", () => {
	it("returns Active if deposits active", async () => {
		mock({
			blockchain: "ethereum",
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "depositsActive",
				return: true,
			},
		});
		const provider: Web3Provider = new ethers.providers.Web3Provider(
			global.ethereum
		);

		const status = await fetchBridgeDepositStatus(api, provider);

		expect(status).toEqual("Active");
	});
	it("returns Inactive if deposits inactive", async () => {
		mock({
			blockchain: "ethereum",
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "depositsActive",
				return: false,
			},
		});
		const provider: Web3Provider = new ethers.providers.Web3Provider(
			global.ethereum
		);

		const status = await fetchBridgeDepositStatus(api, provider);

		expect(status).toEqual("Inactive");
	});
});

describe("ensureBridgeDepositActive", () => {
	it("returns status if active", async () => {
		mock({
			blockchain: "ethereum",
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "depositsActive",
				return: true,
			},
		});
		const provider: Web3Provider = new ethers.providers.Web3Provider(
			global.ethereum
		);

		const status = await ensureBridgeDepositActive(api, provider);

		expect(status).toEqual("Active");
	});
	it("throws if inactive", async () => {
		mock({
			blockchain: "ethereum",
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "depositsActive",
				return: false,
			},
		});
		const provider: Web3Provider = new ethers.providers.Web3Provider(
			global.ethereum
		);

		try {
			await ensureBridgeDepositActive(api, provider);
		} catch (err) {
			expect(err.code).toEqual("DEPOSIT_INACTIVE");
		}
	});
});
