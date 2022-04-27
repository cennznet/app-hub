import signViaMetaMask from "@/utils/signViaMetaMask";
import { CENNZTransaction, waitUntil } from "@/utils";
import { SubmittableExtrinsic } from "@cennznet/api/types";
import { Api } from "@cennznet/api";

const { blockchain, mock } = global.getWeb3MockForTest();
const ethereumAccount = global.getEthereumTestingAccount();

interface EthWalletCall {
	call: SubmittableExtrinsic<"promise", any>;
	nonce: number;
}

const mockApi = {
	rpc: {
		system: {
			accountNextIndex: jest.fn((_address: string) => 5),
		},
	},
	createType: jest.fn((_type: string, _params: EthWalletCall) => ({
		toHex: jest.fn(() => "0x000000000000000"),
	})),
	tx: {
		ethWallet: {
			call: jest.fn(
				(
					_extrinsic: SubmittableExtrinsic<"promise", any>,
					_ethAddress: string,
					_signature: any
				) => ({
					send: jest.fn(async (statusCb) => {
						statusCb({ txHash: "0x000000000000000" });
					}),
				})
			),
		},
	},
};

let mockTx;
beforeEach(() => {
	mockTx = mock({
		blockchain,
		accounts: [ethereumAccount],
		signature: {
			params: [ethereumAccount, "sign"],
			return: "0x000000000000000",
		},
	});
});

describe("signViaMetaMask", () => {
	it("calls api.tx.ethWallet.call with correct address", async () => {
		await signViaMetaMask(
			mockApi as unknown as Api,
			ethereumAccount,
			{} as SubmittableExtrinsic<"promise">
		);

		await waitUntil(1000);

		expect(mockTx).toHaveBeenCalled();
		expect(mockApi.tx.ethWallet.call.mock.calls[0][1]).toEqual(ethereumAccount);
	});
	it("sets txHash and txResult", async () => {
		const transaction: CENNZTransaction = await signViaMetaMask(
			mockApi as unknown as Api,
			ethereumAccount,
			{} as SubmittableExtrinsic<"promise">
		);

		await waitUntil(1000);

		expect(mockTx).toHaveBeenCalled();
		expect(transaction.setHash).toHaveBeenCalledWith("0x000000000000000");
		expect(transaction.setResult).toHaveBeenCalledWith({
			txHash: "0x000000000000000",
		});
	});
});
