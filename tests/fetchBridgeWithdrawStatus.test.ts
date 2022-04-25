import fetchBridgeWithdrawStatus, {
	ensureBridgeWithdrawActive,
} from "@/utils/fetchBridgeWithdrawStatus";
import { Api } from "@cennznet/api";
import { ethers } from "ethers";
import { mock } from "@depay/web3-mock";
import { Web3Provider } from "@ethersproject/providers";
import { KOVAN_PEG_CONTRACT } from "@/constants";
import ERC20Peg from "@/artifacts/ERC20Peg.json";

const api: Api = global.getCENNZApiForTest();

describe("fetchBridgeWithdrawStatus", () => {
	it("returns Active if withdrawals active", async () => {
		mock({
			blockchain: "ethereum",
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "withdrawalsActive",
				return: true,
			},
		});
		const provider: Web3Provider = new ethers.providers.Web3Provider(
			global.ethereum
		);

		const status = await fetchBridgeWithdrawStatus(api, provider);

		expect(status).toEqual("Active");
	});
	it("returns Inactive if withdrawals inactive", async () => {
		mock({
			blockchain: "ethereum",
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "withdrawalsActive",
				return: false,
			},
		});
		const provider: Web3Provider = new ethers.providers.Web3Provider(
			global.ethereum
		);

		const status = await fetchBridgeWithdrawStatus(api, provider);

		expect(status).toEqual("Inactive");
	});
});

describe("ensureBridgeWithdrawActive", () => {
	it("returns status if active", async () => {
		mock({
			blockchain: "ethereum",
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "withdrawalsActive",
				return: true,
			},
		});
		const provider: Web3Provider = new ethers.providers.Web3Provider(
			global.ethereum
		);

		const status = await ensureBridgeWithdrawActive(api, provider);

		expect(status).toEqual("Active");
	});
	it("throws if inactive", async () => {
		mock({
			blockchain: "ethereum",
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "withdrawalsActive",
				return: false,
			},
		});
		const provider: Web3Provider = new ethers.providers.Web3Provider(
			global.ethereum
		);

		try {
			await ensureBridgeWithdrawActive(api, provider);
		} catch (err) {
			expect(err.code).toEqual("WITHDRAW_INACTIVE");
		}
	});
});
