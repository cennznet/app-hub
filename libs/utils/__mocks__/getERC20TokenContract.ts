export default function getERC20PegContract<T>(_tokenAddress, _signer) {
	return {
		approve: jest.fn(async (_pegAddress, _transferAmount) => {
			return {
				hash: "0x000000000000000",
				wait: (confirmations) => Promise.resolve(confirmations),
			};
		}),
	};
}
