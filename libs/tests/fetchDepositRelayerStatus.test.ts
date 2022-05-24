import fetchDepositRelayerStatus from "@utils/fetchDepositRelayerStatus";

describe("fetchDepositRelayerStatus", () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});

	it("returns expected value", async () => {
		fetchMock.once(JSON.stringify({ status: "EthereumConfirming" }), {
			status: 200,
		});

		const status = await fetchDepositRelayerStatus("mock-hash");

		expect(fetch).toHaveBeenCalledTimes(1);
		expect(status).toEqual("EthereumConfirming");
	});
	it("throws if status !== 200", async () => {
		fetchMock.once(null, { status: 404 });

		try {
			await fetchDepositRelayerStatus("mock-bad-hash");
		} catch (err) {
			expect(fetch).toHaveBeenCalledTimes(1);
			expect(err.code).toEqual("RELAYER_404");
		}
	});
});
