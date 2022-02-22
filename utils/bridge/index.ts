import { ethers } from "ethers";
import GenericERC20TokenAbi from "@/artifacts/GenericERC20Token.json";
import { Chain } from "@/types";
import { decodeAddress } from "@polkadot/keyring";
import { Api } from "@cennznet/api";

export const ETH = "0x0000000000000000000000000000000000000000";
export const ETH_LOGO = `images/eth.svg`;

export const CHAINS: Chain[] = [
	{
		name: "CENNZnet",
		logo: "images/cennz.svg",
	},
	{
		name: "Ethereum",
		logo: ETH_LOGO,
	},
];

export const fetchMetamaskBalance = async (ethereum, tokenAddress, account) => {
	const provider = new ethers.providers.Web3Provider(ethereum);
	let balance, decimals;

	if (tokenAddress === ETH) {
		balance = await provider.getBalance(account);
	} else {
		const token: ethers.Contract = new ethers.Contract(
			tokenAddress,
			GenericERC20TokenAbi,
			provider
		);

		decimals = await token.decimals();

		balance = await token.balanceOf(account);
	}

	return Number(ethers.utils.formatUnits(balance, decimals));
};

export const getDepositValues = (amount: string, selectedAccount: string) => {
	const amountInWei = ethers.utils.parseUnits(amount);
	const address = decodeAddress(selectedAccount);

	return { amountInWei, address };
};

export const checkDepositStatus = async (
	api: Api,
	pegContract: ethers.Contract
) => {
	const bridgePaused: any = await api.query.ethBridge.bridgePaused();
	const ETHdepositsActive = await pegContract.depositsActive();
	const CENNZdepositsActive: any = await api.query.erc20Peg.depositsActive();

	return (
		bridgePaused.isFalse && ETHdepositsActive && CENNZdepositsActive.isTrue
	);
};

export const fetchEstimatedFee = async (
	signer,
	bridgeContract: ethers.Contract
) => {
	let gasPrice = (await signer.getGasPrice()).toString();
	gasPrice = ethers.utils.formatUnits(gasPrice);

	const gasEstimate = Number(gasPrice) * 150000;

	let verificationFee = await bridgeContract.verificationFee();
	verificationFee = ethers.utils.formatUnits(verificationFee);

	return gasEstimate + Number(verificationFee);
};

export const fetchTokenId = async (api: Api, tokenAddress: string) => {
	const tokenExist: any = await api.query.erc20Peg.erc20ToAssetId(tokenAddress);

	return tokenExist.isSome
		? tokenExist.unwrap()
		: await api.query.genericAsset.nextAssetId();
};

export const checkWithdrawStatus = async (
	api: Api,
	pegContract: ethers.Contract
) => {
	const bridgePaused: any = await api.query.ethBridge.bridgePaused();
	const CENNZwithdrawalsActive: any =
		await api.query.erc20Peg.withdrawalsActive();
	const ETHwithdrawalsActive = await pegContract.withdrawalsActive();

	return (
		bridgePaused.isFalse &&
		CENNZwithdrawalsActive.isTrue &&
		ETHwithdrawalsActive
	);
};

export const fetchWithdrawEthSideValues = async (
	signatures: string[],
	bridgeContract: ethers.Contract
) => {
	const verificationFee = await bridgeContract.verificationFee();

	const v: any = [],
		r: any = [],
		s: any = [];

	signatures.forEach((signature: any) => {
		const hexifySignature = ethers.utils.hexlify(signature);
		const sig = ethers.utils.splitSignature(hexifySignature);
		v.push(sig.v);
		r.push(sig.r);
		s.push(sig.s);
	});

	return { verificationFee, v, r, s };
};
