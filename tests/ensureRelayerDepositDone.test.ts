import ensureRelayerDepositDone from "@/utils/ensureRelayerDepositDone";

const callback = jest.fn();

describe("ensureRelayerDepositDone", () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});

	it("does nothing if deposit succeeds", async () => {
		fetchMock.once(JSON.stringify({ status: "Success" }), { status: 200 });

		await ensureRelayerDepositDone("mock-hash");

		expect(fetch).toHaveBeenCalledTimes(1);
	});
	it("calls callback if status is `EthereumConfirming` or `CennznetConfirming`", async () => {
		fetchMock.mockResponses(
			[
				JSON.stringify({ status: "EthereumConfirming" }),
				{
					status: 200,
				},
			],
			[
				JSON.stringify({ status: "CennznetConfirming" }),
				{
					status: 200,
				},
			],
			[
				JSON.stringify({ status: "Success" }),
				{
					status: 200,
				},
			]
		);

		await ensureRelayerDepositDone("mock-hash", 10000, callback);

		expect(fetch).toHaveBeenCalledTimes(3);
		expect(callback).toHaveBeenCalledTimes(2);
	});
	it("throws if status is `timeout`", async () => {
		fetchMock.once(JSON.stringify({ status: "timeout" }), { status: 200 });

		try {
			await ensureRelayerDepositDone("mock-hash", 10000);
		} catch (err) {
			expect(err.code).toEqual("RELAYER_TIMEOUT");
		}
	});
	it("throws if status is `Failed`", async () => {
		fetchMock.once(JSON.stringify({ status: "Failed" }), { status: 200 });

		try {
			await ensureRelayerDepositDone("mock-hash", 10000);
		} catch (err) {
			expect(err.code).toEqual("RELAYER_STATUS_FAILED");
		}
	});
});
