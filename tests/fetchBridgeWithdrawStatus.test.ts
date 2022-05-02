import fetchBridgeWithdrawStatus, {
	ensureBridgeWithdrawActive,
} from "@/utils/fetchBridgeWithdrawStatus";
import { KOVAN_PEG_CONTRACT } from "@/constants";
import ERC20Peg from "@/artifacts/ERC20Peg.json";
import { Api } from "@cennznet/api";

const { blockchain, provider, mock } = global.getWeb3MockForTest();

const mockApi = (active: boolean) =>
	({
		query: {
			erc20Peg: {
				withdrawalsActive: jest.fn(() => ({
					isTrue: active,
				})),
			},
			ethBridge: {
				bridgePaused: jest.fn(() => ({
					isFalse: active,
				})),
			},
		},
	} as unknown as Api);

describe("fetchBridgeWithdrawStatus", () => {
	it("returns Active if withdrawals active", async () => {
		mock({
			blockchain,
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "withdrawalsActive",
				return: true,
			},
		});

		const status = await fetchBridgeWithdrawStatus(mockApi(true), provider);

		expect(status).toEqual("Active");
	});
	it("returns Inactive if withdrawals inactive", async () => {
		mock({
			blockchain,
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "withdrawalsActive",
				return: false,
			},
		});

		const status = await fetchBridgeWithdrawStatus(mockApi(false), provider);

		expect(status).toEqual("Inactive");
	});
});

describe("ensureBridgeWithdrawActive", () => {
	it("returns status if active", async () => {
		mock({
			blockchain,
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "withdrawalsActive",
				return: true,
			},
		});

		const status = await ensureBridgeWithdrawActive(mockApi(true), provider);

		expect(status).toEqual("Active");
	});
	it("throws if inactive", async () => {
		mock({
			blockchain,
			call: {
				to: KOVAN_PEG_CONTRACT,
				api: ERC20Peg,
				method: "withdrawalsActive",
				return: false,
			},
		});

		try {
			await ensureBridgeWithdrawActive(mockApi(false), provider);
		} catch (err) {
			expect(err.code).toEqual("WITHDRAW_INACTIVE");
		}
	});
});
