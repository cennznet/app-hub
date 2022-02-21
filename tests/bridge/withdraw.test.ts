import { ethers } from "ethers";
import { mock, connect } from "@depay/web3-mock";
import {
	ETH,
	fetchEstimatedFee,
	checkCENNZnetBalance,
	checkWithdrawStatus,
	fetchTokenId,
} from "@/utils/bridge";
import ERC20Tokens from "@/artifacts/erc20tokens.json";
import ERC20Peg from "@/artifacts/ERC20Peg.json";
import CENNZnetBridge from "@/artifacts/CENNZnetBridge.json";
import { Api } from "@cennznet/api";

const blockchain = "ethereum";
const wallet = "metamask";
const accounts = ["0x699aC2aedF058e76eD900FCc8cB31aB316B35bF2"];
const ERC20PegAddress = "0x8F68fe02884b2B05e056aF72E4F2D2313E9900eC";
const BridgeAddress = "0x369e2285CCf43483e76746cebbf3d1d6060913EC";
const bridgeBalances = {
	CENNZ: {
		balance: 1000,
		decimalPlaces: 4,
		symbol: "CENNZ",
		tokenId: "16000",
	},
	CPAY: {
		balance: 1000,
		decimalPlaces: 4,
		symbol: "CPAY",
		tokenId: "16001",
	},
	ETH: {
		balance: 5,
		decimalPlaces: 18,
		symbol: "ETH",
		tokenId: "17002",
	},
};

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

describe("fetchEstimatedFee", () => {
	it("returns correct fee estimate", async () => {
		const bridge: ethers.Contract = new ethers.Contract(
			BridgeAddress,
			CENNZnetBridge,
			provider
		);
		const verificationFee = "5";
		const mockVerificationFee = mock({
			blockchain,
			call: {
				to: BridgeAddress,
				api: CENNZnetBridge,
				method: "verificationFee",
				return: ethers.utils.parseUnits(verificationFee),
			},
		});

		const signer = provider.getSigner();
		const totalFeeEstimate = await fetchEstimatedFee(signer, bridge);

		let gasPrice: any = (await signer.getGasPrice()).toString();
		gasPrice = ethers.utils.formatUnits(gasPrice);
		const gasEstimate = Number(gasPrice) * 150000;
		const expectedFeeEstimate = gasEstimate + Number(verificationFee);

		expect(mockVerificationFee).toHaveBeenCalled();
		expect(totalFeeEstimate).toEqual(expectedFeeEstimate);
	});
});
describe("checkCENNZnetBalance", () => {
	it("returns true if user has enough balance", async () => {
		const enoughBalanceChecked = await checkCENNZnetBalance(
			api,
			ETH,
			"1",
			bridgeBalances
		);

		expect(enoughBalanceChecked).toBe(true);
	});
	it("returns false if user doesn't have enough balance", async () => {
		const enoughBalanceChecked = await checkCENNZnetBalance(
			api,
			ETH,
			"10",
			bridgeBalances
		);

		expect(enoughBalanceChecked).toBe(false);
	});
	it("returns false if token isn't supported", async () => {
		const DAI = ERC20Tokens.tokens.find((token) => token.symbol === "DAI");
		const enoughBalanceChecked = await checkCENNZnetBalance(
			api,
			DAI.address,
			"0",
			bridgeBalances
		);

		expect(enoughBalanceChecked).toBe(false);
	});
});
describe("fetchTokenId", () => {
	it("returns token id if exists", async () => {
		const tokenId = await fetchTokenId(api, ETH);

		const token: any = await api.query.erc20Peg.erc20ToAssetId(ETH);
		const expectedTokenId = await token.unwrap();
		expect(tokenId).toEqual(expectedTokenId);
	});
	it("returns nextAssetId if token doesn't exist", async () => {
		const UNI = ERC20Tokens.tokens.find(
			(token) => token.chainId === 1 && token.symbol === "UNI"
		);
		const tokenId = await fetchTokenId(api, UNI.address);

		const expectedTokenId = await api.query.genericAsset.nextAssetId();

		expect(tokenId).toEqual(expectedTokenId);
	});
});
describe("checkWithdrawStatus", () => {
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
				method: "withdrawalsActive",
				return: true,
			},
		});

		const bridgeActive = await checkWithdrawStatus(api, peg);

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
				method: "withdrawalsActive",
				return: false,
			},
		});

		const bridgeActive = await checkWithdrawStatus(api, peg);

		expect(mockedTx).toHaveBeenCalled();
		expect(bridgeActive).toBe(false);
	});
});
