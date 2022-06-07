import isCENNZAddress from "@/libs/utils/isCENNZAddress";

const cennzAccount = global.getCENNZTestingAccount();
const ethereumAccount = global.getEthereumTestingAccount();

describe("isCENNZAddress", () => {
	it("returns true if CENNZ address", () => {
		const isCENNZ = isCENNZAddress(cennzAccount);

		expect(isCENNZ).toBe(true);
	});
	it("returns false if not CENNZ address", () => {
		const isCENNZ = isCENNZAddress(ethereumAccount);

		expect(isCENNZ).toBe(false);
	});
});
