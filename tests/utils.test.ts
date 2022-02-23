import { formatBalance } from "@/utils";

describe("formatBalance", () => {
	it("rounds balance to 4 decimals", () => {
		const balance = formatBalance(123.45678);

		const expectedBalance = "123.4568";

		expect(balance).toEqual(expectedBalance);
	});
	it("returns '<0.00001' if balance is <= 0.00001", () => {
		const balance = formatBalance(0.00001);

		const expectedBalance = "<0.00001";

		expect(balance).toEqual(expectedBalance);
	});
	it("returns whole number if balance is whole number", () => {
		const balance = formatBalance(1000);

		const expectedBalance = "1000";
		expect(balance).toEqual(expectedBalance);
	});
});
