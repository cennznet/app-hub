import fetchBridgeDepositStatus, {
	ensureBridgeDepositActive,
} from "@/utils/fetchBridgeDepositStatus";
import { KOVAN_PEG_CONTRACT } from "@/constants";
import ERC20Peg from "@/artifacts/ERC20Peg.json";

const api = global.getCENNZApiForTest();
const { blockchain, provider, mock } = global.getWeb3MockForTest();

describe("fetchBridgeDepositStatus", () => {
	it("returns Active if deposits active", async () => {
		mock({
			blockchain,
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "depositsActive",
				return: true,
			},
		});

		const status = await fetchBridgeDepositStatus(api, provider);

		expect(status).toEqual("Active");
	});
	it("returns Inactive if deposits inactive", async () => {
		mock({
			blockchain,
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "depositsActive",
				return: false,
			},
		});

		const status = await fetchBridgeDepositStatus(api, provider);

		expect(status).toEqual("Inactive");
	});
});

describe("ensureBridgeDepositActive", () => {
	it("returns status if active", async () => {
		mock({
			blockchain,
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "depositsActive",
				return: true,
			},
		});

		const status = await ensureBridgeDepositActive(api, provider);

		expect(status).toEqual("Active");
	});
	it("throws if inactive", async () => {
		mock({
			blockchain,
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "depositsActive",
				return: false,
			},
		});

		try {
			await ensureBridgeDepositActive(api, provider);
		} catch (err) {
			expect(err.code).toEqual("DEPOSIT_INACTIVE");
		}
	});
});
