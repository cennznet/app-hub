import signAndSendTx from "@utils/signAndSendTx";
import { Signer, SubmittableExtrinsic } from "@cennznet/api/types";

const cennzAccount = global.getCENNZTestingAccount();

const extrinsic = {
	signAndSend: jest.fn(async (address, options, statusCb) => {
		if (address === "cancel") throw { message: "Cancelled" };
		statusCb({ txHash: "0x000000000000000" });
	}) as any,
};

describe("signAndSendTx", () => {
	it("calls extrinsic.signAndSend with correct address", async () => {
		await signAndSendTx(
			extrinsic as SubmittableExtrinsic<"promise">,
			cennzAccount,
			{} as Signer
		);

		expect(extrinsic.signAndSend).toHaveBeenCalled();
		expect(extrinsic.signAndSend.mock.calls[0][0]).toEqual(cennzAccount);
	});
	it("sets txHash and txResult", async () => {
		const transaction = await signAndSendTx(
			extrinsic as SubmittableExtrinsic<"promise">,
			cennzAccount,
			{} as Signer
		);

		expect(transaction.setHash).toHaveBeenCalledWith("0x000000000000000");
		expect(transaction.setResult).toHaveBeenCalledWith({
			txHash: "0x000000000000000",
		});
	});
	it("calls tx.setCancel if tx is cancelled", async () => {
		const transaction = await signAndSendTx(
			extrinsic as SubmittableExtrinsic<"promise">,
			"cancel",
			{} as Signer
		);

		expect(transaction.setCancel).toHaveBeenCalled();
	});
});
