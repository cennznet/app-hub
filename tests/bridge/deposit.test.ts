import { ethers } from "ethers";
import { mock, connect } from "@depay/web3-mock";
import { fetchDepositValues, checkDepositStatus } from "@/utils/bridge";
import ERC20Peg from "@/artifacts/ERC20Peg.json";
import { decodeAddress } from "@polkadot/keyring";
import { Api } from "@cennznet/api";

const blockchain = "ethereum";
const wallet = "metamask";
const accounts = ["0x699aC2aedF058e76eD900FCc8cB31aB316B35bF2"];
const CENNZnetAccount = "5FbMzsoEpd2mt8eyKpKUxwJ5S9W7nJVJkCer2Jk7tvSpB1vF";
const ERC20PegAddress = "0x8F68fe02884b2B05e056aF72E4F2D2313E9900eC";

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

describe("fetchDepositValues", () => {
	it("returns correct values", async () => {
		const amount = "500";
		const { amountInWei, address } = fetchDepositValues(
			amount,
			CENNZnetAccount
		);

		const expectedAmountInWei = ethers.utils.parseUnits(amount);
		const expectedAddress = decodeAddress(CENNZnetAccount);

		expect(amountInWei).toEqual(expectedAmountInWei);
		expect(address).toEqual(expectedAddress);
	});
});
describe("checkDepositStatus", () => {
	it("returns true if checks pass", async () => {
		const peg: ethers.Contract = new ethers.Contract(
			ERC20PegAddress,
			ERC20Peg,
			provider
		);

		const mockedTx = mock({
			blockchain,
			call: {
				to: ERC20PegAddress,
				api: ERC20Peg,
				method: "depositsActive",
				return: true,
			},
		});

		const bridgeActive = await checkDepositStatus(api, peg);

		expect(mockedTx).toHaveBeenCalled();
		expect(bridgeActive).toBe(true);
	});
	it("returns false if checks fail", async () => {
		const peg: ethers.Contract = new ethers.Contract(
			ERC20PegAddress,
			ERC20Peg,
			provider
		);

		const mockedTx = mock({
			blockchain,
			call: {
				to: ERC20PegAddress,
				api: ERC20Peg,
				method: "depositsActive",
				return: false,
			},
		});

		const bridgeActive = await checkDepositStatus(api, peg);

		expect(mockedTx).toHaveBeenCalled();
		expect(bridgeActive).toBe(false);
	});
});
// *****************************
// TODO: fix these tests
// Transactions fail with error: TypeError: Cannot read properties of undefined (reading 'length')
// *****************************
// describe("deposit", () => {
// 	it("deposit ETH works with values from fetchDepositValues", async () => {
// 		const amount = "5";
// 		const { amountInWei, address } = fetchDepositValues(
// 			amount,
// 			CENNZnetAccount
// 		);
// 		const peg: ethers.Contract = new ethers.Contract(
// 			ERC20PegAddress,
// 			ERC20Peg,
// 			provider
// 		);

// 		const mockedTx = mock({
// 			blockchain,
// 			transaction: {
// 				to: ERC20PegAddress,
// 				api: ERC20Peg,
// 				from: accounts[0],
// 				method: "deposit",
// 				params: {
// 					tokenType: ETH,
// 					amount: amountInWei,
// 					cennznetAddress: address,
// 				},
// 				value: amountInWei,
// 			},
// 		});

// 		const signer = provider.getSigner();
// 		const tx = await peg.connect(signer).deposit(ETH, amountInWei, address, {
// 			value: amountInWei,
// 		});

// 		expect(tx).toBeDefined();
// 		expect(mockedTx).toHaveBeenCalled();
// 	});
// 	it("deposit ERC20 works with values from fetchDepositValues", async () => {
// 		const DAI = ERC20Tokens.tokens.find(
// 			(token) => token.chainId === 1 && token.symbol === "DAI"
// 		);
// 		const amount = "5";
// 		const { amountInWei, address } = fetchDepositValues(
// 			amount,
// 			CENNZnetAccount
// 		);
// 		const tokenContract = new ethers.Contract(
// 			DAI.address,
// 			GenericERC20TokenAbi,
// 			provider
// 		);
// 		const peg: ethers.Contract = new ethers.Contract(
// 			ERC20PegAddress,
// 			ERC20Peg,
// 			provider
// 		);
// 		const mockedApproveTx = mock({
// 			blockchain,
// 			transaction: {
// 				to: DAI.address,
// 				api: GenericERC20TokenAbi,
// 				from: accounts[0],
// 				method: "approve",
// 				params: { spender: ERC20PegAddress, amount: amountInWei },
// 				return: true,
// 			},
// 		});

// 		const signer = provider.getSigner();
// 		const approveTx = await tokenContract
// 			.connect(signer)
// 			.approve(ERC20PegAddress, amountInWei);

// 		expect(approveTx).toBeDefined();
// 		expect(mockedApproveTx).toHaveBeenCalled();

// 		const mockedTx = mock({
// 			blockchain,
// 			transaction: {
// 				to: ERC20PegAddress,
// 				api: ERC20Peg,
// 				from: accounts[0],
// 				method: "deposit",
// 				params: {
// 					tokenType: DAI.address,
// 					amount: amountInWei,
// 					cennznetAddress: address,
// 				},
// 			},
// 		});

// 		const tx = await peg.deposit(DAI.address, amountInWei, address, {
// 			value: amountInWei,
// 		});

// 		expect(tx).toBeDefined();
// 		expect(mockedTx).toHaveBeenCalled();
// 	});
// });
