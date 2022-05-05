import { Api } from "@cennznet/api";
import { CENNZTransaction, signViaEthWallet } from "@/utils";
import { CENNZnetExtrinsic } from "@/types";

const ethereumAccount = global.getEthereumTestingAccount();

const extrinsic = {
	signViaEthWallet: jest.fn(async (address, _options, _ethereum, statusCb) => {
		if (address === "cancel") throw { message: "Cancelled" };
		statusCb({ txHash: "0x000000000000000" });
	}) as any,
};

describe("signViaEthWallet", () => {
	it("calls extrinsic.signViaEthWallet with correct address", async () => {
		await signViaEthWallet(
			{} as Api,
			ethereumAccount,
			extrinsic as CENNZnetExtrinsic,
			global.ethereum
		);

		expect(extrinsic.signViaEthWallet).toHaveBeenCalled();
		expect(extrinsic.signViaEthWallet.mock.calls[0][0]).toEqual(ethereumAccount);
	});
	it("sets txHash and txResult", async () => {
		const transaction: CENNZTransaction = await signViaEthWallet(
			{} as Api,
			ethereumAccount,
			extrinsic as CENNZnetExtrinsic,
			global.ethereum
		);

		expect(transaction.setHash).toHaveBeenCalledWith("0x000000000000000");
		expect(transaction.setResult).toHaveBeenCalledWith({
			txHash: "0x000000000000000",
		});
	});
		it("calls tx.setCancel if tx is cancelled", async () => {
			const transaction = await signViaEthWallet(
				{} as Api,
				"cancel",
				extrinsic as CENNZnetExtrinsic,
				global.ethereum
			);

			expect(transaction.setCancel).toHaveBeenCalled();
		});
});
