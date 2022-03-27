import { ethers } from "ethers";
import { mock, connect } from "@depay/web3-mock";
import { fetchMetamaskBalance, ETH } from "@/utils/bridge";
import GenericERC20TokenAbi from "@/artifacts/GenericERC20Token.json";
import ERC20Tokens from "@/artifacts/erc20tokens.json";
import { Api } from "@cennznet/api";

const blockchain = "ethereum";
const wallet = "metamask";
const accounts = ["0x699aC2aedF058e76eD900FCc8cB31aB316B35bF2"];

let provider: ethers.providers.Web3Provider, api: Api;
beforeAll(async () => {
	mock({
		blockchain,
		wallet,
		accounts,
		balance: {
			for: accounts[0],
			return: ethers.utils.parseUnits("1000"),
		},
	});
	provider = new ethers.providers.Web3Provider(global.ethereum);
	api = await Api.create({ provider: "wss://nikau.centrality.me/public/ws" });
	connect("ethereum");
});

afterAll(async () => {
	await api.disconnect();
});

describe("fetchMetamaskBalance", () => {
	it("returns ETH balance", async () => {
		const balance: number = await fetchMetamaskBalance(
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
				return: DAI.decimals,
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
				return: ethers.utils.parseUnits("1000"),
			},
		});
		const balance: number = await fetchMetamaskBalance(
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
