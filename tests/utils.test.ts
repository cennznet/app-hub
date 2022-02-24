import { formatBalance } from "@/utils";

describe("formatBalance", () => {
	it("rounds balance to 4 decimals", () => {
		const balance = formatBalance(123.45678);

		const expectedBalance = "123.4568";

		expect(balance).toEqual(expectedBalance);
	});
	it("returns '<0.0001' if balance is <= 0.0001", () => {
		const balance = formatBalance(0.00001);

		const expectedBalance = "<0.0001";

		expect(balance).toEqual(expectedBalance);
	});
	it("returns 0.0000 if balance is 0 or undefined", () => {
		const balance1 = formatBalance(undefined);
		const balance2 = formatBalance(0);

		const expectedBalance = "0.0000";

		expect(balance1).toEqual(balance2);
		expect(balance1).toEqual(expectedBalance);
		expect(balance2).toEqual(expectedBalance);
	});
});
