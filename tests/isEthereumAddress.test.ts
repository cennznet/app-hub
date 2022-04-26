import isEthereumAddress from "@/utils/isEthereumAddress"

const ethereumAccount = global.getEthereumTestingAccount();
const CENNZAccount = global.getCENNZTestingAccount();

describe("isEthereumAddress", () => {
  it("returns true if Ethereum address", () => {
    const isEthereum = isEthereumAddress(ethereumAccount)

    expect(isEthereum).toBe(true)
  })
  it("returns false if not Ethereum address", () => {
    const isEthereum = isEthereumAddress(CENNZAccount)

    expect(isEthereum).toBe(false)
  })
})