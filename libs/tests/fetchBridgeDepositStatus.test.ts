import fetchBridgeDepositStatus, {
	ensureBridgeDepositActive,
} from "@utils/fetchBridgeDepositStatus";
import { KOVAN_PEG_CONTRACT } from "@/libs/constants";
import ERC20Peg from "@artifacts/ERC20Peg.json";
import { Api } from "@cennznet/api";

const { blockchain, provider, mock } = global.getWeb3MockForTest();

const mockApi = (active: boolean) =>
	({
		query: {
			erc20Peg: {
				depositsActive: jest.fn(() => ({
					isTrue: active,
				})),
			},
		},
	} as unknown as Api);

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

		const status = await fetchBridgeDepositStatus(mockApi(true), provider);

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

		const status = await fetchBridgeDepositStatus(mockApi(false), provider);

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

		const status = await ensureBridgeDepositActive(mockApi(true), provider);

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
			await ensureBridgeDepositActive(mockApi(false), provider);
		} catch (err) {
			expect(err.code).toEqual("DEPOSIT_INACTIVE");
		}
	});
});
