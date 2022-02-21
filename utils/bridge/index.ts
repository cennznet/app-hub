import { ethers } from "ethers";
import GenericERC20TokenAbi from "@/artifacts/GenericERC20Token.json";
import { Chain } from "@/types";
import { decodeAddress } from "@polkadot/keyring";
import { Api } from "@cennznet/api";

export const ETH = "0x0000000000000000000000000000000000000000";
export const ETH_LOGO =
	"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png";

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

export const getMetamaskBalance = async (ethereum, tokenAddress, account) => {
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

export const fetchDepositValues = (amount: string, selectedAccount: string) => {
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

export const checkCENNZnetBalance = async (
	api: Api,
	tokenAddress: string,
	amount: string,
	bridgeBalances
) => {
	const tokenId = await fetchTokenId(api, tokenAddress);
	const foundToken: any = Object.values(bridgeBalances).find(
		(token: any) => token.tokenId === tokenId.toString()
	);
	if (foundToken) {
		return foundToken.balance >= Number(amount);
	} else {
		return false;
	}
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
