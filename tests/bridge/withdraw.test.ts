import { ethers } from "ethers";
import { mock, connect, anything } from "@depay/web3-mock";
import { ETH, fetchEstimatedFee, checkWithdrawStatus } from "@/utils/bridge";
import ERC20Peg from "@/artifacts/ERC20Peg.json";
import CENNZnetBridge from "@/artifacts/CENNZnetBridge.json";
import { Api } from "@cennznet/api";

const blockchain = "ethereum";
const wallet = "metamask";
const accounts = ["0x699aC2aedF058e76eD900FCc8cB31aB316B35bF2"];
const ERC20PegAddress = "0x8F68fe02884b2B05e056aF72E4F2D2313E9900eC";
const BridgeAddress = "0x369e2285CCf43483e76746cebbf3d1d6060913EC";
const eventProofSignatures = [
	"0x09dd0f31e13c5f95400754e1699b96652b701cdfce102d604758d18baec1782554f92c596ec4f8a423c8e8780334fdc7867a79d061a33600baf9975962b106e701",
	"0x4da7bc7c0631a34af1e1793f49516b5e85cc5fce1dbd898bc225d6fde5d894247eb79c040d4b32e00f7042b4628ee7053527011944c2b023660cecebf9ca57ae00",
	"0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
	"0xd3aa75af24bed134f6a25050647e2b00880803f0cb81a32cdddf39311e51b7013db3fb93bd40bfbebb5ec18b3918e4aec280fd2c1188eee06c49c6317c5acca900",
	"0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
];

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
describe("withdrawEthSide", () => {
	it("works", async () => {
		const withdrawAmount = ethers.utils.parseUnits("500").toString();
		const peg: ethers.Contract = new ethers.Contract(
			ERC20PegAddress,
			ERC20Peg,
			provider
		);

		const mockedTx = mock({
			blockchain,
			transaction: {
				to: ERC20PegAddress,
				api: ERC20Peg,
				method: "withdraw",
				params: anything,
			},
		});

		const v: any = [],
			r: any = [],
			s: any = [];
		eventProofSignatures.forEach((signature: any) => {
			const hexifySignature = ethers.utils.hexlify(signature);
			const sig = ethers.utils.splitSignature(hexifySignature);
			v.push(sig.v);
			r.push(sig.r);
			s.push(sig.s);
		});
		const validators = (await api.query.ethBridge.notaryKeys() as any).map(
			(validator: ethers.utils.BytesLike) => {
				// session key is not set
				if (
					ethers.utils.hexlify(validator) ===
					ethers.utils.hexlify(
						"0x000000000000000000000000000000000000000000000000000000000000000000"
					)
				) {
					return ethers.constants.AddressZero;
				} else {
					return ethers.utils.computeAddress(validator);
				}
			}
		);
		const signer = provider.getSigner(accounts[0]);
		const tx = await peg
			.connect(signer)
			.withdraw(ETH, withdrawAmount, accounts[0], {
				eventId: 314,
				validatorSetId: 99,
				v,
				r,
				s,
				validators
			});

		expect(tx).toBeDefined();
		expect(mockedTx).toHaveBeenCalled();
	});
});
