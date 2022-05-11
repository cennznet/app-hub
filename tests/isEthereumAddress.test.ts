import isEthereumAddress from "@/utils/isEthereumAddress";

const ethereumAccount = global.getEthereumTestingAccount();
const cennzAccount = global.getCENNZTestingAccount();

describe("isEthereumAddress", () => {
	it("returns true if Ethereum address", () => {
		const isEthereum = isEthereumAddress(ethereumAccount);

		expect(isEthereum).toBe(true);
	});
	it("returns false if not Ethereum address", () => {
		const isEthereum = isEthereumAddress(cennzAccount);

		expect(isEthereum).toBe(false);
	});
});
