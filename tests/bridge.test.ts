import { ethers } from "ethers";
import { mock } from "@depay/web3-mock";
import { Blockchain } from "@depay/web3-blockchains";
import { getMetamaskBalance, ETH } from "@/utils/bridge";
import GenericERC20TokenAbi from "@/artifacts/GenericERC20Token.json";

const blockchain = "ethereum";
const accounts = ["0x699aC2aedF058e76eD900FCc8cB31aB316B35bF2"];
let provider: ethers.providers.Web3Provider,
	signer: ethers.providers.JsonRpcSigner;
beforeAll(() => {
	mock({
		blockchain,
		accounts,
		balance: {
			for: accounts[0],
			return: ethers.utils.parseUnits("1000"),
		},
		network: {
			add: {
				chainId: 42,
				chainName: "Kovan Test Network",
				rpcUrls: [
					"https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
				],
				blockExplorerUrls: ["https://kovan.etherscan.io"],
				nativeCurrency: {
					name: "Ether",
					symbol: "ETH",
					decimals: 18,
				},
			},
			switchTo: "Kovan Test Network",
		},
	});
	provider = new ethers.providers.Web3Provider(global.ethereum);
	signer = provider.getSigner();
});

describe("getMetamaskBalance", () => {
	it("returns ETH balance", async () => {
		const balance: number = await getMetamaskBalance(
			global.ethereum,
			ETH,
			accounts[0]
		);

		const expectedBalance: ethers.BigNumber = await provider.getBalance(
			accounts[0]
		);

		expect(balance).toEqual(Number(ethers.utils.formatUnits(expectedBalance)));
	});
});
