import { ethers } from "ethers";
import { mock, connect } from "@depay/web3-mock";
import { getMetamaskBalance, ETH } from "@/utils/bridge";
import GenericERC20TokenAbi from "@/artifacts/GenericERC20Token.json";
import ERC20Tokens from "@/artifacts/erc20tokens.json";

const blockchain = "ethereum";
const accounts = ["0x699aC2aedF058e76eD900FCc8cB31aB316B35bF2"];
let provider: ethers.providers.Web3Provider;

beforeAll(() => {
	mock({
		blockchain,
		accounts,
		balance: {
			for: accounts[0],
			return: ethers.utils.parseUnits("1000"),
		},
		network: {
			switchTo: "0x2a",
			add: {
				id: "0x2a",
				name: "Kovan",
				networkId: 42,
				label: "Kovan",
				fullName: "Kovan Test Network",
				rpc: "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
				explorer: ["https://kovan.etherscan.io"],
				currency: {
					name: "Ether",
					symbol: "ETH",
					decimals: 18,
				},
				tokens: ERC20Tokens.tokens.filter((token) => token.chainId === 42),
			},
		},
	});
	provider = new ethers.providers.Web3Provider(global.ethereum);
});

beforeAll(async () => {
	await global.ethereum.request({
		method: "wallet_switchEthereumChain",
		params: [{ chainId: "0x2a" }],
	});

	connect("ethereum");
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
	it("returns DAI balance", async () => {
		const DAI = ERC20Tokens.tokens.find(
			(token) => token.chainId === 42 && token.symbol === "DAI"
		);
		mock({
			blockchain: "ethereum",
			call: {
				to: DAI.address,
				api: GenericERC20TokenAbi,
				method: "decimals",
				return: "18",
			},
		});
		mock({
			blockchain: "ethereum",
			call: {
				to: DAI.address,
				api: GenericERC20TokenAbi,
				method: "balanceOf",
				params: accounts[0],
				decimals: DAI.decimals,
				return: "1000000000000000000",
			},
		});
		const balance: number = await getMetamaskBalance(
			global.ethereum,
			DAI.address,
			accounts[0]
		);

		const contract = new ethers.Contract(
			DAI.address,
			GenericERC20TokenAbi,
			provider
		);
		const decimals = await contract.decimals();
		const expectedBalance = await contract.balanceOf(accounts[0]);

		expect(balance).toEqual(
			Number(ethers.utils.formatUnits(expectedBalance, decimals))
		);
	});
});
