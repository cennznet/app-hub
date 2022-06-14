import getTokenLogo from "@/libs/utils/getTokenLogo";

describe("getTokenLogo", () => {
	it("returns expected value", () => {
		const logo = getTokenLogo("SHIB");

		expect(logo.src).toMatch("SHIB");
	});
});
