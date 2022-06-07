import sendDepositRequest from "@/libs/utils/sendDepositRequest";
import { Balance, EthereumTransaction, waitUntil } from "@/libs/utils";

const { ethAsset, cennzAsset } = global.getEthereumAssetsForTest();
const cennzAccount = global.getCENNZTestingAccount();
const ethereumAccount = global.getEthereumTestingAccount();
const { provider } = global.getWeb3MockForTest();

jest.mock("@/libs/utils/getERC20PegContract");
jest.mock("@/libs/utils/getERC20TokenContract");

describe("sendDepositRequest", () => {
	it("sends request ETH", async () => {
		const transaction: EthereumTransaction = await sendDepositRequest(
			new Balance(1, ethAsset),
			ethAsset,
			cennzAccount,
			provider.getSigner(ethereumAccount)
		);

		await waitUntil(1000);

		expect(transaction.setHash).toHaveBeenCalledWith("0x000000000000000");
		expect(transaction.setSuccess).toHaveBeenCalled();
	});
	it("sends request ERC20", async () => {
		const transaction: EthereumTransaction = await sendDepositRequest(
			new Balance(10, cennzAsset),
			cennzAsset,
			cennzAccount,
			provider.getSigner(ethereumAccount)
		);

		await waitUntil(1000);

		expect(transaction.setHash).toHaveBeenCalledWith("0x000000000000000");
		expect(transaction.setSuccess).toHaveBeenCalled();
	});
	it("calls tx.setCancel if error code is 4001", async () => {
		const transaction: EthereumTransaction = await sendDepositRequest(
			new Balance(0, ethAsset),
			ethAsset,
			cennzAccount,
			provider.getSigner(ethereumAccount)
		);

		await waitUntil(1000);

		expect(transaction.setCancel).toHaveBeenCalled();
	});
	it("calls tx.setFailure if error code is other than 4001", async () => {
		const transaction: EthereumTransaction = await sendDepositRequest(
			new Balance(5, ethAsset),
			ethAsset,
			cennzAccount,
			provider.getSigner(ethereumAccount)
		);

		await waitUntil(1000);

		expect(transaction.setFailure).toHaveBeenCalled();
	});
});
