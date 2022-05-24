import {
	getDaysHoursMinutes,
	getMinutesAndSeconds,
	getDistance,
} from "@utils/getExpiryString";

let expiresAt: number;
beforeEach(() => {
	expiresAt = Number((Date.now() / 1000 + 200000).toFixed());
});

describe("getDistance", () => {
	it("returns expected value", () => {
		const distance = getDistance(expiresAt);

		const expiry = expiresAt * 1000;
		const expected = expiry - Date.now();

		expect(distance).toBeCloseTo(expected);
	});
});

describe("getDaysHoursMinutes", () => {
	it("returns expected string", () => {
		const expiry = getDaysHoursMinutes(expiresAt);

		const distance = getDistance(expiresAt);
		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

		const expected = `${days}d ${hours}h ${minutes}m`;

		expect(expiry).toMatch(expected);
	});
});

describe("getMinutesAndSeconds", () => {
	it("returns expected string", () => {
		const expiry = getMinutesAndSeconds(expiresAt);

		const distance = getDistance(expiresAt);
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((distance % (1000 * 60)) / 1000);

		const expected = `${minutes}m ${seconds}s`;

		expect(expiry).toMatch(expected);
	});
});
