import isCENNZAddress from "@/utils/isCENNZAddress";

const CENNZAccount = global.getCENNZTestingAccount();
const ethereumAccount = global.getEthereumTestingAccount();

describe("isCENNZAddress", () => {
	it("returns true if CENNZ address", () => {
		const isCENNZ = isCENNZAddress(CENNZAccount);

		expect(isCENNZ).toBe(true);
	});
	it("returns false if not CENNZ address", () => {
		const isCENNZ = isCENNZAddress(ethereumAccount);

		expect(isCENNZ).toBe(false);
	});
});
