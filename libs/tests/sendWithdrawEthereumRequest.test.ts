import sendWithdrawEthereumRequest from "@/libs/utils/sendWithdrawEthereumRequest";
import { Balance, EthereumTransaction, waitUntil } from "@/libs/utils";
import { EthEventProof } from "@cennznet/api/derives/ethBridge/types";
import { Signer } from "ethers";
import { HistoricalEventProof } from "@/libs/types";

const api = global.getCENNZApiForTest();
const { ethAsset } = global.getEthereumAssetsForTest();
const ethereumAccount = global.getEthereumTestingAccount();

jest.mock("@utils/getERC20PegContract");
jest.mock("@utils/getBridgeContract");

describe("sendWithdrawEthereumRequest", () => {
	it("sends request", async () => {
		const transaction: EthereumTransaction = await sendWithdrawEthereumRequest(
			api,
			{} as EthEventProof,
			new Balance(10, ethAsset),
			ethAsset,
			ethereumAccount,
			{} as Signer
		);

		await waitUntil(1000);

		expect(transaction.setHash).toHaveBeenCalledWith("0x000000000000000");
		expect(transaction.setSuccess).toHaveBeenCalled();
	});
	it("sends historical request", async () => {
		const transaction: EthereumTransaction = await sendWithdrawEthereumRequest(
			api,
			{
				validators: ["v1", "v2", "v3", "v4", "v5"],
			} as unknown as HistoricalEventProof,
			new Balance(10, ethAsset),
			ethAsset,
			ethereumAccount,
			{} as Signer
		);

		await waitUntil(1000);

		expect(transaction.setHash).toHaveBeenCalledWith("0x000000000000000");
		expect(transaction.setSuccess).toHaveBeenCalled();
	});
	it("calls tx.setCancel if error code is 4001", async () => {
		const transaction: EthereumTransaction = await sendWithdrawEthereumRequest(
			api,
			{} as EthEventProof,
			new Balance(0, ethAsset),
			ethAsset,
			ethereumAccount,
			{} as Signer
		);

		await waitUntil(1000);

		expect(transaction.setCancel).toHaveBeenCalled();
	});
	it("calls tx.setFailure if error code is other than 4001", async () => {
		const transaction: EthereumTransaction = await sendWithdrawEthereumRequest(
			api,
			{} as EthEventProof,
			new Balance(5, ethAsset),
			ethAsset,
			ethereumAccount,
			{} as Signer
		);

		await waitUntil(1000);

		expect(transaction.setFailure).toHaveBeenCalled();
	});
});
