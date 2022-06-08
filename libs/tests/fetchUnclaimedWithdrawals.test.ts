import fetchUnclaimedWithdrawals from "@/libs/utils/fetchUnclaimedWithdrawals";
import { Balance, getDaysHoursMinutes } from "@/libs/utils";

const api = global.getCENNZApiForTest();

const mockProof1 = {
	_id: "100",
	validatorSetId: "1",
	r: ["r1", "r2", "r3", "r4", "r5"],
	s: ["s1", "s2", "s3", "s4", "s5"],
	v: [1, 2, 3, 4, 5],
	validators: ["val1", "val2", "val3", "val4", "val5"],
	__v: 0,
};

const mockProof2 = {
	_id: "101",
	validatorSetId: "1",
	r: ["r1", "r2", "r3", "r4", "r5"],
	s: ["s1", "s2", "s3", "s4", "s5"],
	v: [1, 2, 3, 4, 5],
	validators: ["val1", "val2", "val3", "val4", "val5"],
	__v: 0,
};

const mockWithdrawals = {
	_id: "mockAccount",
	__v: 0,
	withdrawals: [
		{
			proofId: "100",
			amount: "500000 ",
			assetId: "16000",
			beneficiary: "mock-beneficiary",
			txHash: "mock-hash",
			hasClaimed: false,
			expiresAt: 1648249574,
			_id: "mock-id",
		},
		{
			proofId: "101",
			amount: "10000000000 ",
			assetId: "17010",
			beneficiary: "mock-beneficiary",
			txHash: "mock-hash",
			hasClaimed: false,
			expiresAt: 1648335972,
			_id: "mock-id",
		},
	],
};

describe("fetchUnclaimedWithdrawals", () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});

	it("returns expected values", async () => {
		fetchMock.mockResponses(
			[JSON.stringify(mockWithdrawals), { status: 200 }],
			[JSON.stringify(mockProof1), { status: 200 }],
			[JSON.stringify(mockProof2), { status: 200 }]
		);

		const unclaimed = await fetchUnclaimedWithdrawals("mockAccount", api);

		const transferAsset1 = {
			assetId: 16000,
			address: "0x673f0244bd0aebd9918ef089f75c503df9bfbb38",
			symbol: "CENNZ",
			decimals: 4,
			decimalsValue: 10000,
		};

		const transferAsset2 = {
			assetId: 17010,
			address: "0xc778417e063141139fce010982780140aa0cd5ab",
			symbol: "WETH",
			decimals: 18,
			decimalsValue: 1000000000000000000,
		};

		const expected = [
			{
				assetId: 16000,
				expiry: getDaysHoursMinutes(1648249574),
				expiryRaw: 1648249574,
				eventProofId: 100,
				transferAsset: transferAsset1,
				transferAmount: new Balance(500000, transferAsset1),
				beneficiary: "mock-beneficiary",
				eventProof: { ...mockProof1, eventId: "100" },
			},
			{
				assetId: 17010,
				expiry: getDaysHoursMinutes(1648335972),
				expiryRaw: 1648335972,
				eventProofId: 101,
				transferAsset: transferAsset2,
				transferAmount: new Balance(10000000000, transferAsset2),
				beneficiary: "mock-beneficiary",
				eventProof: { ...mockProof2, eventId: "101" },
			},
		];

		expect(unclaimed).toEqual(expected);
	});
	it("throws if no unclaimed withdrawals found", async () => {
		fetchMock.once(null, { status: 404 });
		try {
			await fetchUnclaimedWithdrawals("mock-address", api);
		} catch (error) {
			expect(fetch).toHaveBeenCalledTimes(1);
			expect(error.message).toEqual("No UNclaimed withdrawals found");
		}
	});
});
