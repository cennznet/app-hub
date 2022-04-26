import sendDepositRequest from "@/utils/sendDepositRequest";
import { Balance, EthereumTransaction } from "@/utils";
import { KOVAN_PEG_CONTRACT } from "@/constants";
import { ethers } from "ethers";
import ERC20Peg from "@/artifacts/ERC20Peg.json";
import GenericERC20Token from "@/artifacts/GenericERC20Token.json";
import { anything } from "@depay/web3-mock";

const { ethAsset, cennzAsset } = global.getEthereumAssetsForTest();
const cennzAccount = global.getCENNZTestingAccount();
const ethereumAccount = global.getEthereumTestingAccount();
const { blockchain, mock, provider } = global.getWeb3MockForTest();

// beforeAll(() => {
//   mock({
//     blockchain,
//     wallet: "metamask",
//     accounts: [ethereumAccount],
//     balance: {
//       for: ethereumAccount,
//       return: ethers.utils.parseUnits("1000"),
//     },
//   });
// })

describe("sendDepositRequest", () => {
	it("sends request ETH", async () => {
		const transferAmount = new Balance(1, ethAsset);

		// const mockTx = mock({
		//   blockchain,
		//   transaction: {
		//     to: KOVAN_PEG_CONTRACT,
		//     api: ERC20Peg,
		//     method: "deposit",
		//     params: anything
		//   }
		// })

		const tx: EthereumTransaction = await sendDepositRequest(
			transferAmount,
			ethAsset,
			cennzAccount,
			provider.getSigner(ethereumAccount)
		);

		expect(tx).toBeDefined();
		// expect(mockedTx).toHaveBeenCalled();
	});
	it("sends request ERC20", async () => {
		const transferAmount = new Balance(10, cennzAsset);

		const mockApproval = mock({
			blockchain,
			transaction: {
				to: cennzAsset.address,
				api: GenericERC20Token,
				method: "approve",
				params: anything,
				return: true,
			},
		});

		// const mockTx = mock({
		//   blockchain,
		//   transaction: {
		//     to: KOVAN_PEG_CONTRACT,
		//     api: ERC20Peg,
		//     method: "deposit",
		//     params: anything
		//   }
		// })

		const tx: EthereumTransaction = await sendDepositRequest(
			transferAmount,
			cennzAsset,
			cennzAccount,
			provider.getSigner(ethereumAccount)
		);

		expect(tx).toBeDefined();
		expect(mockApproval).toHaveBeenCalled();
		//expect(mockTx).toHaveBeenCalled();
	});
});
