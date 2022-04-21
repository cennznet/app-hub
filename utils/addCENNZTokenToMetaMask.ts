import { CENNZ_IPFS, CENNZ_METAMASK_NETWORK } from "@/constants";

export default async function addCENNZTokenToMetamask() {
	await global.ethereum.request({
		method: "wallet_watchAsset",
		params: {
			type: "ERC20",
			options: {
				address: CENNZ_METAMASK_NETWORK.cennzTokenAddress,
				symbol: "CENNZ",
				decimals: 4,
				image: CENNZ_IPFS,
			},
		},
	});
}
