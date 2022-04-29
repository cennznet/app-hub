import { fetchUnclaimedEventProof } from "@/utils";

const mockProof = {
	_id: "100",
	validatorSetId: "1",
	r: ["r1", "r2", "r3", "r4", "r5"],
	s: ["s1", "s2", "s3", "s4", "s5"],
	v: [1, 2, 3, 4, 5],
	validators: ["val1", "val2", "val3", "val4", "val5"],
	__v: 0,
};

describe("fetchUnclaimedEventProof", () => {
	beforeEach(() => {
		fetchMock.resetMocks();
	});

	it("returns expected value", async () => {
		fetchMock.mockResponseOnce(JSON.stringify(mockProof));
		const eventProof = await fetchUnclaimedEventProof(100);

		expect(fetch).toHaveBeenCalledTimes(1);
		expect(eventProof).toEqual(mockProof);
	});

	it("throws if no event proof found", async () => {
		fetchMock.once(null, { status: 404 });
		try {
			await fetchUnclaimedEventProof(0);
		} catch (error) {
			expect(fetch).toHaveBeenCalledTimes(1);
			expect(error.message).toEqual("No event proof found");
		}
	});
});
